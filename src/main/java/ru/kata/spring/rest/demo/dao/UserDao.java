package ru.kata.spring.rest.demo.dao;

import ru.kata.spring.rest.demo.model.User;

import java.util.List;

public interface UserDao {

    User findByName(String username);
    void delete(Long id);
    void update(User us);
    boolean add(User user);
    List<User> listUsers();
    User findById(Long id);

}
