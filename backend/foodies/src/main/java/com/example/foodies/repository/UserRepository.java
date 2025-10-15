package com.example.foodies.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.foodies.entity.UserEntity;
import java.util.List;


@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {
    UserEntity findByPhoneNumber(String phoneNumber);
    UserEntity findByEmail(String email);
}
