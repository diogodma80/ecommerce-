package com.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import com.ecommerce.entity.Country;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.ProductCategory;
import com.ecommerce.entity.State;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{
	
	private EntityManager entityManager;
	
	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager) {
		entityManager = theEntityManager;
	}

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		HttpMethod[] theUnsupportedMethods = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};
		
		//disable HTTP methods for Product repository: PUT, POST and DELETE		
		disableHttpMethods(Product.class, config, theUnsupportedMethods);
		
		//disable HTTP methods for ProductCategory repository: PUT, POST and DELETE
		disableHttpMethods(ProductCategory.class, config, theUnsupportedMethods);
		
		//disable HTTP methods for Country repository: PUT, POST and DELETE
		disableHttpMethods(Country.class, config, theUnsupportedMethods);
		
		//disable HTTP methods for State repository: PUT, POST and DELETE
		disableHttpMethods(State.class, config, theUnsupportedMethods);
	
		// call an internal help method to expose the ids
			exposeIds(config);
	}

	private void disableHttpMethods(Class<?> theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedMethods) {
		
		config.getExposureConfiguration()
			.forDomainType(theClass)
			.withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethods))
			.withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethods));
	}

	private void exposeIds(RepositoryRestConfiguration config) {
		// expose entity ids
		
		// get a list of all entity classes from the entity manager
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		// create an array of the entity types
		List<Class> entityClasses = new ArrayList<>();
		
		// get the entity types for the entities
		for(EntityType<?> tempEntityType : entities) {
			entityClasses.add(tempEntityType.getJavaType());
		}
		
		// expose the entity ids for the array of entity/domain types
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
		
	}
	
	

}
