# Reactive Encapsulation Pattern Example

## Description

This repository contains an example Angular application implemented using the Reactive Encapsulation Pattern.

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `ng serve` to start the application

## Structure

The project follows a clear structure to showcase the implementation of the Reactive Encapsulation Pattern:

1. **src/**
   - **app/**
     - **layout/**
       - `components`
     - **model-data-hub/**
       - **\_dependencies/** `// abstractions, helpers, etc`
       - **product/** `// example of a model`
         - `product.model.ts`
         - `product.store.ts`
         - `product.api-servise.ts`
   - **assets/**
   - **environment/**

## Components

### API Service abstraction

- Located in `src/app/model-data-hub/_dependencies/api-abstraction.service.ts`
- Manages communication with the backend API for products.
- Integrates with the Store to update state after fetching data.

### Store abstraction

- Located in `src/app/model-data-hub/_dependencies/store-abstraction.service.ts`
- StoreAbstraction for products using ELF State Management.
- Tracks the state of entities, allowing for entity updates and retrieval.

### Example Model

- Located in `src/app/model-data-hub/product/product.model.ts`
- Defines the product Model, encapsulating data and providing methods for entity management.
- Inherits from BaseModel and implements ICommonDataControl.

### Base Model

- Located in `src/app/model-data-hub/base-model-abstraction.ts`
- Abstract class providing a base structure for model entities.
- Defines common methods and properties shared by all models.

## Usage

Feel free to explore the code and comments within each component to understand how the Reactive Encapsulation Pattern is
applied.

## Contributions

If you have any suggestions or improvements, feel free to open an issue or submit a pull request!
