package com.example.foodies.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.example.foodies.entity.Counters;

@Service
public class SequenceGeneratorService {
     @Autowired
    private MongoTemplate mongoTemplate;

    public long getNextSequence(String seqName) {
        Query query = new Query(Criteria.where("_id").is(seqName));
        Update update = new Update().inc("sequenceValue", 1);
        FindAndModifyOptions options = FindAndModifyOptions.options().returnNew(true).upsert(true);

        Counters counter = mongoTemplate.findAndModify(query, update, options, Counters.class);
        return counter != null ? counter.getSequenceValue() : 1;
    }
}
