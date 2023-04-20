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

const DEFAULT_HEIGHT = 100;
const DEFAULT_WIDTH = 100;
const DEFAULT_RADIUS = 100;
const DEFAULT_CAPACITY = 10;
const DEFAULT_TABLE = "T1";

const EditIcon = () => {
  const [image] = useImage("https://i.ibb.co/CK6b3GS/Edit.png");
  return <Image image={image} height={10} width={10} />;
};
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */

const MyCircle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  openEditModal,
  canEdit,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected && canEdit) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Group
        draggable={canEdit}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        dragBoundFunc={(pos) => {
          let x = pos.x;
          let y = pos.y;

          // Define the boundaries where the element can be dragged
          const minX = -window.innerWidth * 0.31;
          const minY = -window.innerHeight * 0.06;
          const maxX = window.innerWidth * 0.61;
          const maxY = window.innerHeight * 0.61;

          // Limit the movement of the element within the boundaries
          if (x < minX) {
            x = minX;
          }
          if (y < minY) {
            y = minY;
          }
          if (x > maxX) {
            x = maxX;
          }
          if (y > maxY) {
            y = maxY;
          }

          // Return the new position of the element
          return { x, y };
        }}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
          });
        }}
      >
        <Circle radius={DEFAULT_RADIUS} {...shapeProps} />
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
          text={shapeProps.table}
          fontSize={12}
          fontStyle="bold"
          fontFamily="Calibri"
          fill="gray"
          x={shapeProps.x - shapeProps.width / 2 + 38}
          y={shapeProps.y + shapeProps.height / 2 - 45}
        ></Text>
        {!!canEdit && (
          <Group
            x={shapeProps.x - shapeProps.width / 2 + 70}
            y={shapeProps.y + shapeProps.height / 2 - 85}
            onClick={() => {
              openEditModal();
            }}
          >
            <EditIcon />
          </Group>
        )}
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
  canEdit,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected && canEdit) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Group
        draggable={canEdit}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        dragBoundFunc={(pos) => {
          let x = pos.x;
          let y = pos.y;

          // Define the boundaries where the element can be dragged
          const minX = -window.innerWidth * 0.34;
          const minY = -window.innerHeight * 0.125;
          const maxX = window.innerWidth * 0.58;
          const maxY = window.innerHeight * 0.54;

          // Limit the movement of the element within the boundaries
          if (x < minX) {
            x = minX;
          }
          if (y < minY) {
            y = minY;
          }
          if (x > maxX) {
            x = maxX;
          }
          if (y > maxY) {
            y = maxY;
          }

          // Return the new position of the element
          return { x, y };
        }}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
          });
        }}
      >
        <Rect
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
          text={shapeProps.table}
          fontSize={12}
          fontStyle="bold"
          fontFamily="Calibri"
          fill="gray"
          x={shapeProps.x + 25}
          y={shapeProps.y + shapeProps.height - 35}
        ></Text>
        {!!canEdit && (
          <Group
            x={shapeProps.x + 75}
            y={shapeProps.y + shapeProps.height - 85}
            onClick={() => {
              openEditModal();
            }}
          >
            <EditIcon />
          </Group>
        )}
      </Group>
      {isSelected && canEdit && (
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

const DEFAULT_SHAPE = {
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WIDTH,
  fill: "white",
  capacity: DEFAULT_CAPACITY,
  table: DEFAULT_TABLE,
  quantity: 0,
  reserved: false,
};

const DineIn = ({ isAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [canEdit, setCanEdit] = useState(false);
  // TODO _previousShapes should come from backend
  const _previousShapes = [
    {
      type: "rectangle",
      x: 500,
      y: 100,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      fill: "#fff",
      id: crypto.randomUUID(),
      capacity: DEFAULT_CAPACITY,
      table: "T1",
      quantity: 0,
      reserved: false,
    },
    {
      type: "circle",
      x: 800,
      y: 100,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      fill: "#fff",
      id: crypto.randomUUID(),
      capacity: DEFAULT_CAPACITY,
      table: "T1",
      quantity: 0,
      reserved: false,
    },
  ];
  const [shapes, setShapes] = useState(_previousShapes);
  const [shape, setShape] = useState(DEFAULT_SHAPE);
  const [selectedObj, setSelectedObj] = React.useState({});

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedObj({ id: null, shape: null });
    }
  };

  const addNewShape = () => {
    setCanEdit(false);
    setShapes((prev) => [
      ...prev,
      {
        type: shape?.type,
        x: 500,
        y: 100,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        fill: "#fff",
        id: crypto.randomUUID(),
        capacity: shape?.capacity,
        table: shape?.table,
        quantity: shape?.quantity,
        reserved: shape?.reserved,
      },
    ]);
    return;
  };

  const updateShape = () => {
    const _index = shapes.findIndex(({ id }) => id === selectedObj.id);
    const _shape = {
      ...shapes[_index],
      fill: "#FFF",
      capacity: shape.capacity,
      table: shape.table,
      quantity: shape.quantity,
      reserved: shape.reserved,
    };
    const _shapes = [...shapes];
    _shapes[_index] = _shape;
    setShapes([..._shapes]);
    return;
  };

  const handleClear = () => {
    setShapes([]);
  };

  const handleDeleteObj = () => {
    const _shapes = shapes;
    const filteredShapes = _shapes.filter(
      (shape) => shape.id !== selectedObj.id
    );
    setShapes([...filteredShapes]);
    return;
  };

  const handleInterchange = () => {
    const _shapes = shapes;
    const _shapeIndex = _shapes.findIndex(
      (shape) => shape.id === selectedObj.id
    );
    const selectedShape = _shapes[_shapeIndex];

    let newSelectedShape;

    switch (selectedObj.shape) {
      case "rectangle":
        newSelectedShape = {
          ...selectedShape,
          type: "circle",
          height: selectedObj.height,
          width: selectedObj.height,
          x: selectedObj.x + selectedObj.width / 2,
          y: selectedObj.y + selectedObj.height / 2,
        };
        break;

      case "circle":
        newSelectedShape = {
          ...selectedShape,
          type: "rectangle",
          height: selectedObj.height,
          width: selectedObj.width,
          x: selectedObj.x - selectedObj.width / 2,
          y: selectedObj.y - selectedShape.width / 2,
        };
        break;
      default:
        return;
    }
    _shapes[_shapeIndex] = newSelectedShape;
    setShapes([..._shapes]);
    return;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{canEdit ? "Edit Shape" : "Add new shape"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={5}>
              <Flex flexDir="column" mt={4} gap={2}>
                <Select
                  placeholder="Shape"
                  onChange={(e) => {
                    setShape((prev) => ({ ...prev, type: e.target.value }));
                  }}
                  value={shape?.type}
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Circle</option>
                </Select>
                <Box>
                  <FormLabel>Capacity</FormLabel>

                  <Input
                    placeholder={canEdit ? shape?.capacity : 10}
                    type="number"
                    onChange={(e) => {
                      setShape((prev) => ({
                        ...prev,
                        capacity: parseInt(e.target.value),
                      }));
                    }}
                  />
                </Box>
                <Box>
                  <FormLabel>Table Name</FormLabel>

                  <Input
                    placeholder={canEdit ? shape?.table : "T1"}
                    type="string"
                    onChange={(e) => {
                      setShape((prev) => ({
                        ...prev,
                        table: e.target.value,
                      }));
                    }}
                  />
                </Box>
                <Box>
                  <FormLabel>Current size</FormLabel>
                  <Input
                    placeholder={canEdit ? shape?.quantity : "Current Size"}
                    type="number"
                    onChange={(e) => {
                      setShape((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value),
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
                      setShape((prev) => ({
                        ...prev,
                        reserved: e.target.checked,
                      }));
                    }}
                    defaultChecked={canEdit ? shape?.reserved : false}
                  >
                    Checkbox
                  </Checkbox>
                </Box>
              </Flex>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (canEdit) {
                  updateShape();
                } else {
                  addNewShape();
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
          {!!isAdmin && (
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
                  setShape(DEFAULT_SHAPE);
                  onOpen();
                }}
                variant="solid"
              >
                Add new shape
              </Button>

              <Button
                bg="primary.main"
                color="white"
                onClick={handleInterchange}
              >
                Interchange
              </Button>
              <Button bg="primary.main" color="white" onClick={handleDeleteObj}>
                Delete
              </Button>
              <Button bg="primary.main" color="white" onClick={handleClear}>
                Clear
              </Button>
            </div>
          )}
        </div>
      </Layer>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        style={{ background: "#AFB4BB" }}
        offset={[1, 2]}
      >
        <Layer>
          {shapes.map((shape, i) => {
            switch (shape.type) {
              case "circle":
                return (
                  <MyCircle
                    key={i}
                    canEdit={isAdmin}
                    shapeProps={shape}
                    isSelected={shape.id === selectedObj.id}
                    onSelect={(e) => {
                      setSelectedObj((prev) => {
                        return {
                          ...shape,
                          shape: "circle",
                          x: e.target.attrs.x,
                          y: e.target.attrs.y,
                        };
                      });
                    }}
                    onChange={(newAttrs) => {
                      setSelectedObj((prev) => ({
                        ...prev,
                        ...shape,
                        shape: "circle",
                        height: newAttrs.height,
                        width: newAttrs.width,
                        x: newAttrs.x + shape.x,
                        y: newAttrs.y + shape.y,
                      }));
                    }}
                    openEditModal={() => {
                      setCanEdit(true);
                      onOpen();
                    }}
                  />
                );

              case "rectangle":
                return (
                  <Rectangle
                    key={i}
                    canEdit={isAdmin}
                    shapeProps={shape}
                    isSelected={shape.id === selectedObj.id}
                    onSelect={(e) => {
                      setSelectedObj({
                        ...shape,
                        shape: "rectangle",
                        x: e.target.attrs.x,
                        y: e.target.attrs.y,
                      });
                    }}
                    onChange={(newAttrs) => {
                      setSelectedObj((prev) => ({
                        ...prev,
                        ...shape,
                        shape: "rectangle",
                        height: newAttrs.height,
                        width: newAttrs.width,
                        x: newAttrs.x + shape.x,
                        y: newAttrs.y + shape.y,
                      }));
                    }}
                    openEditModal={() => {
                      setCanEdit(true);
                      onOpen();
                    }}
                  />
                );
              default:
                return;
            }
          })}
        </Layer>
      </Stage>
    </>
  );
};

const App = () => {
  // TODO Update isAdmin accordingly from backend
  const isAdmin = true;
  return <DineIn isAdmin={isAdmin} />;
};
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
