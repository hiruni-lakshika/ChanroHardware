package com.project.v1.repository;

import com.project.v1.entity.Postatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface POStatusRepository extends JpaRepository<Postatus, Integer> {
}
