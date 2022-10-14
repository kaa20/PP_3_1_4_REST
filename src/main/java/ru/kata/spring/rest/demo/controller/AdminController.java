package ru.kata.spring.rest.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.rest.demo.model.Role;
import ru.kata.spring.rest.demo.model.User;
import ru.kata.spring.rest.demo.service.UserService;

import java.util.List;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/roles")
    private ResponseEntity<List<Role>> allRoles() {
        final List<Role> roles = userService.listRoles();
        if (roles == null || roles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<Role> getRole(@PathVariable("id") long id) {
        Role role = userService.findRoleById(id);
        return new ResponseEntity<>(role, HttpStatus.OK);
    }


    @GetMapping("/users")
    private ResponseEntity<List<User>> allUsers() {
        final List<User> users = userService.listUsers();
        if (users == null || users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") long id) {
        User user = userService.findUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.findUserByUsername(user.getUsername()) == null) {
            userService.add(user);
        }
        return new ResponseEntity<>(userService.findUserByUsername(user.getUsername()), HttpStatus.CREATED);
    }


    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable Long id) {
        if (user.getId() != id) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userService.update(user);
        return new ResponseEntity<>(userService.findUserById(id), HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<User> DeleteModal(@PathVariable("id") long id) {

        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
