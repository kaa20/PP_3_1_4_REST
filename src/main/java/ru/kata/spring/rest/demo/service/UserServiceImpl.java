package ru.kata.spring.rest.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.rest.demo.dao.RoleDaoImpl;

import ru.kata.spring.rest.demo.dao.UserDaoImpl;
import ru.kata.spring.rest.demo.model.Role;
import ru.kata.spring.rest.demo.model.User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final RoleDaoImpl roleDao;
    private final UserDaoImpl userDao;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(RoleDaoImpl roleDao, UserDaoImpl userDao, PasswordEncoder passwordEncoder) {
        this.roleDao = roleDao;
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean addRole(Role role) {
        Role userFromDB = roleDao.findByName(role.getRole());
        if(userFromDB != null) {return false;}
        roleDao.add(role);
        return true;
    }

    public Role findRoleByName(String name) { return roleDao.findByName(name); }

    public List<Role> listRoles() { return roleDao.listRoles(); }

    public Role findRoleById(Long id) {
        return roleDao.findById(id);
    }

    public List<Role> listByRole(List<String> name) {
        return roleDao.listByName(name);
    }

    public boolean add(User user) {
        User userFromDB = userDao.findByName(user.getUsername());
        if(userFromDB != null) {return false;}
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.add(user);
        return true;
    }

    public boolean addUserWithRole(User user, String rolename) {
        User userFromDB = userDao.findByName(user.getUsername());
        if(userFromDB != null) {return false;}
        Role role = roleDao.findByName(rolename);
        if (role == null) {
            roleDao.add(new Role(rolename));
        }
        List<Role> roles = new ArrayList<>();
        roles.add(role);
        user.setRoles(roles);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.add(user);
        return true;
    }

    public List<User> listUsers() {
        return userDao.listUsers();
    }

    public void delete(Long id) {
        userDao.delete(id);
    }

    public void update(User user) {
        User userFromDB = findUserById(user.getId());
        if(!userFromDB.getPassword().equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userDao.update(user);
    }

    public User findUserById(Long id) {
        return userDao.findById(id);
    }

    public User findUserByUsername(String userName) {
        return userDao.findByName(userName);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User userFromDB = findUserByUsername(username);
        if (userFromDB == null) {
            throw new UsernameNotFoundException(username + " not found");
        }
        UserDetails user = new org.springframework.security.core.userdetails.User(userFromDB.getUsername(), userFromDB.getPassword(), aug(userFromDB.getRoles()));
        return userFromDB;
    }

    private Collection<? extends GrantedAuthority> aug(Collection<Role> roles) {
        return roles.stream().map(r -> new SimpleGrantedAuthority(r.getRole()))
                .collect(Collectors.toList());
    }
}
