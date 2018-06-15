package top.haw358.springboot.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.haw358.springboot.mapper.User1Mapper;
import top.haw358.springboot.mapper.UserMapper;
import top.haw358.springboot.model.User;
import top.haw358.springboot.model.User1;
import top.haw358.springboot.service.UserService;
import top.haw358.springboot.service.UserService1;

import javax.cache.annotation.CacheDefaults;
import javax.cache.annotation.CacheResult;

/**
 * Created by haw on 17-8-30.
 */
@Service
@Transactional
@CacheConfig(cacheNames="users")
public class UserServiceImpl1 implements UserService1 {

    @Autowired
    private User1Mapper user1Mapper;

    @Override
    @CachePut(key = "#obj.id")
    public User1 add(User1 obj) {
        user1Mapper.insertSelective(obj);
        return obj;
    }

    @Override
    @CacheEvict(key="#id")
    public void delete(Long id) {
        user1Mapper.deleteByPrimaryKey(id);
    }

    @Override
    @CachePut(key = "#obj.id")
    public User1 update(User1 obj) {
        user1Mapper.updateByPrimaryKeySelective(obj);
        return user1Mapper.selectByPrimaryKey(obj.getId());
    }

    @Override
    @Cacheable(key="#id")
    public User1 get(Long id) {
        return user1Mapper.selectByPrimaryKey(id);
    }

}
