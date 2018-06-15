package top.haw358.springboot.model;

import java.util.Date;
import javax.persistence.*;

@Table(name = "t_user1")
public class User1 extends BaseEntity {

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "last_accessed")
    private Date lastAccessed;

    private String password;

    private String username;


    /**
     * @return created_date
     */
    public Date getCreatedDate() {
        return createdDate;
    }

    /**
     * @param createdDate
     */
    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    /**
     * @return is_active
     */
    public Boolean getIsActive() {
        return isActive;
    }

    /**
     * @param isActive
     */
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    /**
     * @return last_accessed
     */
    public Date getLastAccessed() {
        return lastAccessed;
    }

    /**
     * @param lastAccessed
     */
    public void setLastAccessed(Date lastAccessed) {
        this.lastAccessed = lastAccessed;
    }

    /**
     * @return password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password
     */
    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    /**
     * @return username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username
     */
    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }
}