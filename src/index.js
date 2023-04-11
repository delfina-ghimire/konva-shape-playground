import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Transformer,
  Text,
  Group,
  Image,
} from "react-konva";
import { Checkbox, extendTheme } from "@chakra-ui/react";
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import useImage from "use-image";

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
const MAX_POS_Y = window.innerHeight * 0.5;
const MAX_POS_X = window.innerWidth * 0.5;

const DEFAULT_HEIGHT = 100;
const DEFAULT_WIDTH = 100;
const DEFAULT_RADIUS = 100;
const DEFAULT_CAPACITY = 10;

const EditIcon = () => {
  const [image] = useImage("https://i.ibb.co/CK6b3GS/Edit.png");
  return <Image image={image} height={15} width={15} />;
};
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomNumber(_max) {
  return Math.random() * (_max - MIN_POS) + MIN_POS;
}

const MyCircle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  openEditModal,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  console.log("shapeProps", shapeProps);
  return (
    <React.Fragment>
      <Group
        draggable
        // x={200}
        // y={100}
        // radius={100}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      >
        <Circle x={200} y={100} radius={50} {...shapeProps} />
        <Text
          text={`Capacity: ${shapeProps.capacity}`}
          fontSize={10}
          fontFamily="Calibri"
          fill="gray"
          x={shapeProps.x - shapeProps.width / 2 + 30}
          y={shapeProps.y + shapeProps.height / 2 - 30}
        ></Text>
        <Circle
          x={shapeProps.x - shapeProps.width / 2 + 30}
          y={shapeProps.y + shapeProps.height / 2 - 40}
          radius={5}
          fill={
            shapeProps.reserved
              ? "gray"
              : shapeProps.capacity === shapeProps.quantity
              ? "red"
              : "green"
          }
        />
        <Text
          text={`T1`}
          fontSize={12}
          fontStyle="bold"
          fontFamily="Calibri"
          fill="gray"
          x={shapeProps.x - shapeProps.width / 2 + 38}
          y={shapeProps.y + shapeProps.height / 2 - 45}
        ></Text>
        <Group
          x={shapeProps.x - shapeProps.width / 2 + 70}
          y={shapeProps.y + shapeProps.height / 2 - 85}
          onClick={() => {
            openEditModal();
          }}
        >
          <EditIcon />
        </Group>
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  openEditModal,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Group
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      >
        <Rect
          x={200}
          y={100}
          height={DEFAULT_HEIGHT}
          width={DEFAULT_WIDTH}
          cornerRadius={24}
          {...shapeProps}
        />

        <Text
          text={`Capacity: ${shapeProps.capacity}`}
          fontSize={10}
          fontFamily="Calibri"
          fill="gray"
          x={shapeProps.x + 10}
          y={shapeProps.y + shapeProps.height - 20}
        ></Text>
        <Circle
          x={shapeProps.x + 15}
          y={shapeProps.y + shapeProps.height - 30}
          radius={5}
          fill={
            shapeProps.reserved
              ? "gray"
              : shapeProps.capacity === shapeProps.quantity
              ? "red"
              : "green"
          }
        />
        <Text
          text={`T1`}
          fontSize={12}
          fontStyle="bold"
          fontFamily="Calibri"
          fill="gray"
          x={shapeProps.x + 25}
          y={shapeProps.y + shapeProps.height - 35}
        ></Text>
        <Group
          x={shapeProps.x + 75}
          y={shapeProps.y + shapeProps.height - 85}
          onClick={() => {
            openEditModal();
          }}
        >
          <EditIcon />
        </Group>
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [canEdit, setCanEdit] = useState(false);
  const [rectangles, setRectangles] = React.useState([]);
  const [rectangleShape, setRectangleShape] = React.useState({
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    fill: "white",
    capacity: DEFAULT_CAPACITY,
    quantity: 0,
    reserved: false,
  });

  const [circleShape, setCircleShape] = React.useState({
    radius: DEFAULT_RADIUS,
    fill: "white",
    capacity: DEFAULT_CAPACITY,
    quantity: 0,
    reserved: false,
  });
  const [circles, setCircles] = React.useState([
    {
      x: 500,
      y: 100,
      width: circleShape.radius,
      height: circleShape.radius,
      fill: circleShape.fill,
      id: crypto.randomUUID(),
      capacity: circleShape.capacity,
      quantity: circleShape.quantity,
      reserved: circleShape.reserved,
    },
  ]);
  const [selectedShape, setSelectedShape] = React.useState("");

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
            x: 500,
            y: 100,
            width: circleShape.radius,
            height: circleShape.radius,
            fill: circleShape.fill,
            id: crypto.randomUUID(),
            capacity: circleShape.capacity,
            quantity: circleShape.quantity,
            reserved: circleShape.reserved,
          },
        ]);
        return;

      case "rectangle":
        setRectangles((prev) => [
          ...prev,
          {
            x: 500,
            y: 100,
            width: rectangleShape.width,
            height: rectangleShape.height,
            fill: rectangleShape.fill,
            id: crypto.randomUUID(),
            capacity: rectangleShape.capacity,
            quantity: rectangleShape.quantity,
            reserved: rectangleShape.reserved,
          },
        ]);
        return;

      default:
        return;
    }
  };

  const updateShape = (shape) => {
    switch (shape) {
      case "circle":
        const _index = circles.findIndex(({ id }) => id === selectedObj.id);
        const _circle = {
          ...circles[_index],
          width: circleShape.radius,
          height: circleShape.radius,
          fill: "#FFF",
          capacity: circleShape.capacity,
          quantity: circleShape.quantity,
          reserved: circleShape.reserved,
        };
        const _circles = [...circles];
        _circles[_index] = _circle;
        setCircles([..._circles]);
        break;

      case "rectangle":
        const _rectangleIndex = rectangles.findIndex(
          ({ id }) => id === selectedObj.id
        );
        const _rectangle = {
          ...rectangles[_rectangleIndex],
          width: parseInt(rectangleShape.width),
          height: parseInt(rectangleShape.height),
          fill: rectangleShape.fill,
          capacity: rectangleShape.capacity,
          quantity: rectangleShape.quantity,
          reserved: rectangleShape.reserved,
        };
        console.log("rec", _rectangle);
        const _rectangles = [...rectangles];
        _rectangles[_rectangleIndex] = _rectangle;
        setRectangles([..._rectangles]);
        break;
      default:
        break;
    }
    return;
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
    console.log("interchange clicked", selectedObj);
    switch (selectedObj.shape) {
      case "rectangle":
        handleDeleteObj("rectangle");
        setCircles((prev) => [
          ...prev,
          {
            ...selectedObj,
            id: crypto.randomUUID(),
            x: 500,
            y: 100,
            fill: "#fff",
          },
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
            x: 500,
            y: 100,
          },
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
          <ModalHeader>{canEdit ? "Edit" : "Add new shape"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Shape"
              onChange={(e) => {
                setSelectedShape(e.target.value);
              }}
              value={selectedShape}
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
                    <FormLabel>Capacity</FormLabel>

                    <Input
                      placeholder={10}
                      type="number"
                      onChange={(e) => {
                        setRectangleShape((prev) => ({
                          ...prev,
                          capacity: e.target.value,
                        }));
                      }}
                    />
                  </Box>
                  <Box>
                    <FormLabel>Current size</FormLabel>
                    <Input
                      placeholder={"Current Size"}
                      type="number"
                      onChange={(e) => {
                        setRectangleShape((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }));
                      }}
                    />
                  </Box>
                  <Box>
                    <FormLabel>Reserved</FormLabel>

                    <Checkbox
                      size="md"
                      colorScheme="green"
                      onChange={(e) => {
                        setRectangleShape((prev) => ({
                          ...prev,
                          reserved: e.target.checked,
                        }));
                      }}
                    >
                      Checkbox
                    </Checkbox>
                  </Box>
                </Flex>
              ) : null}
              {selectedShape === "circle" ? (
                <Flex flexDir="column" gap={2}>
                  <Flex flexDir="row" mt={4} gap={2} alignItems="flex-end">
                    <Box>
                      <FormLabel>Radius</FormLabel>
                      <Input
                        placeholder={
                          canEdit ? selectedObj.width : DEFAULT_RADIUS
                        }
                        type="number"
                        onChange={(e) => {
                          setCircleShape((prev) => ({
                            ...prev,
                            radius: e.target.value,
                          }));
                        }}
                      />
                    </Box>
                    <Box>
                      <FormLabel>Capacity</FormLabel>

                      <Input
                        placeholder={canEdit ? selectedObj.capacity : 10}
                        type="number"
                        onChange={(e) => {
                          setCircleShape((prev) => ({
                            ...prev,
                            capacity: e.target.value,
                          }));
                        }}
                      />
                    </Box>
                  </Flex>
                  <Flex flexDir="row" mt={4} gap={2} alignItems="flex-start">
                    <Box>
                      <FormLabel>Current Size</FormLabel>

                      <Input
                        placeholder={
                          canEdit ? selectedObj.size : "Current Size"
                        }
                        type="number"
                        onChange={(e) => {
                          setCircleShape((prev) => ({
                            ...prev,
                            quantity: e.target.value,
                          }));
                        }}
                      />
                    </Box>
                  </Flex>
                  <Box>
                    <FormLabel>Reserved</FormLabel>

                    <Checkbox
                      size="md"
                      colorScheme="green"
                      onChange={(e) => {
                        setCircleShape((prev) => ({
                          ...prev,
                          reserved: e.target.checked,
                        }));
                      }}
                    >
                      Checkbox
                    </Checkbox>
                  </Box>
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
                    if (canEdit) {
                      updateShape("rectangle");
                      break;
                    }
                    addNewShape("rectangle");
                    break;
                  case "circle":
                    if (canEdit) {
                      updateShape("circle");
                      break;
                    }
                    addNewShape("circle");
                    break;
                  default:
                    break;
                }
                onClose();
              }}
            >
              {canEdit ? "Edit" : "Add"}
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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Heading as="h2" size="2xl">
            Playground For Dine In
          </Heading>
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
              onClick={() => {
                setCanEdit(false);
                setSelectedShape("");
                onOpen();
              }}
              variant="solid"
            >
              Add new shape
            </Button>

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
        </div>
      </Layer>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        style={{ background: "#AFB4BB" }}
      >
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
                    ...circle,
                    shape: "circle",
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
                openEditModal={() => {
                  setCanEdit(true);
                  setSelectedShape("circle");
                  onOpen();
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
                    ...rect,
                    shape: "rectangle",
                  });
                }}
                onChange={(newAttrs) => {
                  const rects = rectangles.slice();
                  setSelectedObj((prev) => ({
                    ...prev,
                    height: newAttrs.height,
                    width: newAttrs.width,
                    x: newAttrs.x,
                    y: newAttrs.y,
                  }));
                  rects[i] = newAttrs;
                }}
                openEditModal={() => {
                  setCanEdit(true);
                  setSelectedShape("rectangle");
                  onOpen();
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
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
