package top.haw358.springboot.service;


import top.haw358.springboot.model.User;

/**
 * Created by haw on 17-8-30.
 */
public interface UserService {
    User getUser(Long id);
}
