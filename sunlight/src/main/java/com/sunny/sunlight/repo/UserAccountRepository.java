package com.sunny.sunlight.repo;

import com.sunny.sunlight.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> { }