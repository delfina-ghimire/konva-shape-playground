
# Floorplan Playground
## Index

- [Background](#background)
- [About](#about)
- [Preview](#preview)
- [Demo](#demo)
- [Built with](#technologies)




<a id='background'/>

 ## :thought_balloon: Background
Recently, I was given an opportunity and a challenge at work to figure out an useful technology that can help create
a mock layout of a restaurant floorplan. I was involved in the whole process, from research and selecting a library to
developing a Minimal Viable Product (MVP). During this journey, I stumbled upon Konva, and it has become my go to tool
for similiar usecase ever since then.

Furthermore, I have created a beginner's guide about it on Medium. Here's the link if you want to check it out.
[Konva for Beginners: An Introduction](https://medium.com/@around_delfi/a-beginners-guide-to-konva-an-introduction-ca9e98adda88)


<a id='about'/>

 ## :information_source: About

This MVP allows you to create a floorplan layout for a restaurant. Here are the features:

Add new shape
A table shape (square or circle) can be added with following properties :
Table name
Capacity: What is the capacity of the table?
Current size: What part of the table is occupied?
Reservation Status
The shape is movable, resizable and interchangable with each other.

Edit Shape: Each shape comes with an edit icon where you can change and update all the initial properties for it.

Delete shape: If a shape needs to be removed from the layout, the user can simply select the shape and delete it from the stage.

Clear stage: With the press of a button, the user can clear the entire layout and start over.


Indicators: Each shape on the layout comes with an indicator that shows if the table is Reserved, Available, or Occupied 
which is dynamically calculated. 

Two Views: The MVP has two different views - Admin and Viewer. T
he Admin view allows editing of the layout, while the Viewer view is only for viewing purposes. 

<a id='preview'/>

## :framed_picture: Preview

Check out how it looks:

![App Screenshot](./frontend/src/img/signup-preview.png)



<a id='demo'/>

## :link: Demo

[Click to see Live Demo](https://floorplan-playground.netlify.app/)



<a id='technologies'/>

## :hammer: Built With

This project was developed with the following technologies:

#### **Frontend** <sub><sup>React</sup></sub>
  - [React Konva](https://konvajs.org/)
  - [React](#)
  - [Chakra UI](#)



## :love_letter: Feedback

If you have any feedback, please reach out to me at [delfina.ghimire@gmail.com](delfina.ghimire@gmail.com)


















