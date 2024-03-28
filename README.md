# Reactive Encapsulation Pattern Example 🚀

## 🌐 Blog

Explore the Reactive Encapsulation Pattern in Angular through our detailed blog post. It offers insights and practical
applications of this pattern to simplify and enhance your Angular projects. Discover how to leverage the pattern for
better modularity and complexity management in web development.

[Reactive Encapsulation Pattern in Angular](https://wearenotch.com/reactive-encapsulation-pattern-in-angular/)

## 📖 Description

This repository showcases an Angular application demonstrating the Reactive Encapsulation Pattern, aiming to offer a
practical approach to managing complexity and enhancing modularity in web development.

## 🛠 Installation

To explore this example, follow these straightforward steps:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run json:server` to start the server
4. Run `ng serve` to start the application

## 🏗 Structure

The project is organized to clearly demonstrate the pattern in action:

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

## 🚧 Components

### API Service abstraction

- Path: `src/app/model-data-hub/_dependencies/api-abstraction.service.ts`
- Function: Facilitates backend communication, integrated with the store for state management.

### Store abstraction

- Path: `src/app/model-data-hub/_dependencies/store-abstraction.service.ts`
- Role: Manages the state of product entities, supporting updates and retrieval.

### Example Model

- Path: `src/app/model-data-hub/product/product.model.ts`
- Details: Represents the product entity, showcasing methods for entity management.

### Base Model

- Path: `src/app/model-data-hub/base-model-abstraction.ts`
- Purpose: Provides a foundational structure for model entities, with common methods and properties.

## 📚 Usage

We encourage you to delve into the code and accompanying comments to grasp how the Reactive Encapsulation Pattern is
applied within this project.

## 💡 Contributions

Feedback and contributions are welcome. If you have suggestions or improvements, please open an issue or submit a pull
request.
