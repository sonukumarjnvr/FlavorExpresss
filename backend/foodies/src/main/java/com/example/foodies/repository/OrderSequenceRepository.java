package com.example.foodies.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.foodies.entity.Counters;

@Repository
public interface OrderSequenceRepository extends MongoRepository<Counters, String> {

}
