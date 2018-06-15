package top.haw358.springboot.mapper;

import org.springframework.stereotype.Repository;
import top.haw358.springboot.model.User;
import top.haw358.springboot.util.BaseMapper;

@Repository
public interface UserMapper extends BaseMapper<User> {
    /*@Select("SELECT * FROM t_user")
    @Results({
            @Result(property = "name",  column = "name"),
            @Result(property = "password", column = "password")
    })
    List<User> getAll();

    @Select("SELECT name, password FROM t_user WHERE id = #{id}")
    @Results({
            @Result(property = "name",  column = "name"),
            @Result(property = "password", column = "password")
    })
    User getOne(Long id);

    @Insert("INSERT INTO t_user(name,password) VALUES(#{name}, #{passWord})")
    int insert(User user);

    @Update("UPDATE t_user SET name=#{name},passWord=#{passWord} WHERE id =#{id}")
    void update(User user);

    @Delete("DELETE FROM t_user WHERE id =#{id}")
    void delete(Long id);*/

}