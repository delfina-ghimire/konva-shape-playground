import { Box, Button, ChakraProvider, Flex, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle, Transformer, Text } from "react-konva";

import { extendTheme } from "@chakra-ui/react";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    primary: {
      main: "#1a202c",
    },
    brand: {
      100: "#f7fafc",
      // ...
      900: "#1a202c",
    },
  },
});

const MIN_POS = 50;
const MAX_POS = window.innerHeight - 100;

const DEFAULT_HEIGHT = 100
const DEFAULT_WIDTH = 100
const DEFAULT_RADIUS = 100

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomNumber() {
  return Math.random() * (MAX_POS - MIN_POS) + MIN_POS;
}

const MyCircle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
    
      <Circle
        x={200}
        y={100}
        radius={50}
        fill="green"
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: node.width() * scaleX,
            height: node.height() * scaleY
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rectangles, setRectangles] = React.useState([]);
  const [circles, setCircles] = React.useState([]);
  const [selectedShape, setSelectedShape] = React.useState('')
  const [rectangleShape, setRectangleShape] = React.useState({
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    fill: 'red'
  })

   const [circleShape, setCircleShape] = React.useState({
    radius: DEFAULT_RADIUS,
    fill: 'red'
  })

  const [selectedObj, setSelectedObj] = React.useState({});

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedObj({ id: null, shape: null });
    }
  };

  const addNewShape = (shape) => {
    switch (shape) {
      case "circle":
        setCircles((prev) => [
          ...prev,
          {
            x: getRandomNumber(),
            y: getRandomNumber(),
            width: circleShape.radius,
            height: circleShape.radius,
            fill: circleShape.fill,
            id: crypto.randomUUID()
          }
        ]);
        return;

      case "rectangle":
        setRectangles((prev) => [
          ...prev,
          {
            x: getRandomNumber(),
            y: getRandomNumber(),
            width: rectangleShape.width,
            height: rectangleShape.height,
            fill: rectangleShape.fill,
            id: crypto.randomUUID()
          }
        ]);
        return;

      default:
        return;
    }
  };

  const handleClear = () => {
    setRectangles([]);
    setCircles([]);
  };

  const handleDeleteObj = () => {
    switch (selectedObj.shape) {
      case "rectangle":
        const _rectangels = rectangles;
        const filteredRectangles = _rectangels.filter(
          (rect) => rect.id !== selectedObj.id
        );
        setRectangles(filteredRectangles);
        return;

      case "circle":
        const _circles = circles;
        const filteredCircles = _circles.filter(
          (circle) => circle.id !== selectedObj.id
        );
        setCircles(filteredCircles);
        return;
      default:
        return;
    }
  };

  const handleInterchange = () => {
    console.log("interchange clicked");
    switch (selectedObj.shape) {
      case "rectangle":
        handleDeleteObj("rectangle");
        setCircles((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            x: selectedObj.x + (selectedObj.width ?? 0) / 2,
            y: selectedObj.y + (selectedObj.height ?? 0) / 2
          }
        ]);
        return;

      case "circle":
        const _circles = circles;
        const filteredCircles = _circles.filter(
          (circle) => circle.id !== selectedObj.id
        );
        setCircles(filteredCircles);
        const selectedCircle = _circles.find(
          (circle) => circle.id === selectedObj.id
        );

        setRectangles((prev) => [
          ...prev,
          {
            ...selectedCircle,
            id: crypto.randomUUID(),
            height: selectedObj.height ?? selectedCircle.height,
            width: selectedObj.height ?? selectedCircle.height,
            x: selectedObj.x - (selectedObj.width ?? 0) / 2,
            y: selectedObj.y - (selectedObj.height ?? 0) / 2
          }
        ]);
        return;

      default:
        return;
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new shape</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Shape"
              onChange={(e) => {
                setSelectedShape(e.target.value);
              }}
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </Select>
            <Box mt={5}>
              {selectedShape === "rectangle" ? (
                <Flex flexDir="column" mt={4} gap={2}>
                  <Box>
                    <FormLabel>Height</FormLabel>
                    <Input
                      placeholder={DEFAULT_HEIGHT}
                      type="number"
                      onChange={(e) => {
                        setRectangleShape((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }));
                      }}
                    />
                  </Box>
                  <Box>
                    <FormLabel>Width</FormLabel>

                    <Input
                      placeholder={DEFAULT_WIDTH}
                      type="number"
                      onChange={(e) => {
                        setRectangleShape((prev) => ({
                          ...prev,
                          width: e.target.value,
                        }));
                      }}
                    />
                  </Box>
                  <Box>
                    <FormLabel>Color</FormLabel>

                    <Input
                      type="color"
                      onChange={(e) => {
                        setRectangleShape((prev) => ({
                          ...prev,
                          fill: e.target.value,
                        }));
                      }}
                    />
                  </Box>
                </Flex>
              ) : null}
              {selectedShape === "circle" ? (
                <Flex flexDir="row" mt={4} gap={2} alignItems="flex-end">
                  <Box>
                    <FormLabel>Radius</FormLabel>
                    <Input
                      placeholder={DEFAULT_RADIUS}
                      type="number"
                      onChange={(e) => {
                        setCircleShape((prev) => ({
                          ...prev,
                          radius: e.target.value,
                        }));
                      }}
                    />
                  </Box>

                  <Input
                    type="color"
                    onChange={(e) => {
                      setCircleShape((prev) => ({
                        ...prev,
                        fill: e.target.value,
                      }));
                    }}
                  />
                </Flex>
              ) : null}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                switch (selectedShape) {
                  case "rectangle":
                    addNewShape("rectangle");
                    break;
                  case "circle":
                    addNewShape("circle");
                    break;
                  default:
                    break;
                }
                onClose();
              }}
            >
              Add
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Layer>
        <div
          style={{
            marginBottom: "10px",
            backgroundColor: "ButtonHighlight",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Button
            bg="primary.main"
            color="white"
            onClick={onOpen}
            variant="solid"
          >
            Add new shape
          </Button>
          {/* <Button onClick={() => addNewShape("circle")}>Add circle</Button>
          <Button onClick={() => addNewShape("rectangle")}>
            Add Rectangle
          </Button> */}
          <Button bg="primary.main" color="white" onClick={handleInterchange}>
            Interchange
          </Button>
          <Button bg="primary.main" color="white" onClick={handleDeleteObj}>
            Delete
          </Button>
          <Button bg="primary.main" color="white" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </Layer>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          <Text text="Playground for Dine In" fontSize={20} />
        </Layer>

        <Layer>
          {circles.map((circle, i) => {
            return (
              <MyCircle
                key={i}
                shapeProps={circle}
                isSelected={circle.id === selectedObj.id}
                onSelect={() => {
                  // console.log("hello circle", circle);
                  setSelectedObj({
                    id: circle.id,
                    shape: "circle",
                    height: circle.height,
                    width: circle.width,
                    x: circle.x,
                    y: circle.y,
                  });
                }}
                onChange={(newAttrs) => {
                  const rects = rectangles.slice();
                  rects[i] = newAttrs;
                  setSelectedObj((prev) => ({
                    ...prev,
                    height: newAttrs.height,
                    width: newAttrs.width,
                    x: newAttrs.x,
                    y: newAttrs.y,
                  }));
                }}
              />
            );
          })}
        </Layer>

        <Layer>
          {rectangles.map((rect, i) => {
            return (
              <Rectangle
                key={i}
                shapeProps={rect}
                isSelected={rect.id === selectedObj.id}
                onSelect={() => {
                  setSelectedObj({
                    id: rect.id,
                    shape: "rectangle",
                    height: rect.height,
                    width: rect.width,
                    x: rect.x,
                    y: rect.y,
                  });
                }}
                onChange={(newAttrs) => {
                  const rects = rectangles.slice();
                  console.log("rect attr", newAttrs);

                  setSelectedObj((prev) => ({
                    ...prev,
                    height: newAttrs.height,
                    width: newAttrs.width,
                    x: newAttrs.x,
                    y: newAttrs.y,
                  }));
                  rects[i] = newAttrs;
                  setRectangles(rects);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<ChakraProvider theme={theme}><App /></ChakraProvider>);
