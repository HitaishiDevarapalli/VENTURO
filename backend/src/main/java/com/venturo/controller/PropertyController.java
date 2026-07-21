package com.venturo.controller;

import com.venturo.entity.Property;
import com.venturo.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    @GetMapping
    public List<Property> getAll() {
        return propertyRepository.findAll();
    }

    @PostMapping
    public Property create(@RequestBody Property p) {
        return propertyRepository.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> update(@PathVariable Long id, @RequestBody Property details) {
        return propertyRepository.findById(id).map(p -> {
            p.setTitle(details.getTitle());
            p.setPrice(details.getPrice());
            p.setCity(details.getCity());
            p.setState(details.getState());
            p.setArea(details.getArea());
            return ResponseEntity.ok(propertyRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return propertyRepository.findById(id).map(p -> {
            propertyRepository.delete(p);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}