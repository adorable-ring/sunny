package com.sunny.sunlight.repo;

import com.sunny.sunlight.model.Category;
import com.sunny.sunlight.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
	List<Item> findByCategory(Category category);
}