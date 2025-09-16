package com.sunny.sunlight.repo;

import com.sunny.sunlight.model.Item;
import com.sunny.sunlight.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
	List<Review> findByItem(Item item);
}
