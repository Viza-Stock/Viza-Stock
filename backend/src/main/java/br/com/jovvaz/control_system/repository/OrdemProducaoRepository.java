package br.com.jovvaz.control_system.repository;

import br.com.jovvaz.control_system.model.OrdemProducao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdemProducaoRepository extends JpaRepository<OrdemProducao, String> {
}