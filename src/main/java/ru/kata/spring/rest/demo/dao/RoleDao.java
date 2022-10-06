package ru.kata.spring.rest.demo.dao;

import ru.kata.spring.rest.demo.model.Role;

import java.util.List;

public interface RoleDao {
    Role findById(Long id);
    Role findByName(String name);
    boolean add(Role user);
    List<Role> listRoles();
    List<Role> listByName(List<String> name);
}
