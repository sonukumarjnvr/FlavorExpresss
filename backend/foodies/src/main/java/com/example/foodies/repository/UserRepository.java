package com.example.foodies.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.foodies.entity.UserEntity;



@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {
    UserEntity findByPhoneNumber(String phoneNumber);
    UserEntity findByEmail(String email);
}
