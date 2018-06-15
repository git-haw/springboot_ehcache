package top.haw358.springboot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import top.haw358.springboot.model.User;
import top.haw358.springboot.model.User1;
import top.haw358.springboot.service.UserService;
import top.haw358.springboot.service.UserService1;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Date;

/**
 * Created by haw on 17-8-30.
 */
@Controller
@RequestMapping("/users1")
public class UserController1 {

    @Autowired
    private UserService1 userService1;

    @PostMapping("/add")
    @ResponseBody
    public String add(@Valid User1 user, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            return bindingResult.getFieldError().getDefaultMessage();
        }
        user.setCreatedDate(new Date());
        user.setIsActive(true);
        userService1.add(user);
        return "OK";
    }

    @PostMapping("/delete/{id}")
    @ResponseBody
    public String delete(@PathVariable("id") Long id) {
        userService1.delete(id);
        return "OK";
    }

    @PostMapping("/update")
    @ResponseBody
    public String update(User1 user1) {
        userService1.update(user1);
        return "OK";
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public User1 get(@PathVariable("id") Long id) {
        return userService1.get(id);
    }

}
