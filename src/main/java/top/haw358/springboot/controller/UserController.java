package top.haw358.springboot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import top.haw358.springboot.model.User;
import top.haw358.springboot.service.UserService;

/**
 * Created by haw on 17-8-30.
 */
@Controller
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping("/{id}")
    @ResponseBody
    public User test(@PathVariable("id") Long id){
        return userService.getUser(id);
    }

}
