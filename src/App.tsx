import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Upload,
  message,
  Card,
  Image as AntImage,
  Row,
  Col,
  Form,
  Empty,
  Typography,
  Layout,
  ColorPicker,
  Select,
  Table,
  Popconfirm,
} from "antd";
import { GithubOutlined, UploadOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const { Footer } = Layout;
const { Text } = Typography;
const { Option } = Select;

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [spriteWidth, setSpriteWidth] = useState(400);
  const [spriteHeight, setSpriteHeight] = useState(400);
  const [totalSprites, setTotalSprites] = useState(60);
  const [animationSpeed, setAnimationSpeed] = useState(30);

  const [sprites, setSprites] = useState<HTMLCanvasElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);

  const [backgroundColor, setBackgroundColor] = useState<string>("#90EE90");

  const [options, setOptions] = useState([
    { id: 1, width: 16, height: 16, totalSprites: 10, speed: 12 },
    { id: 2, width: 32, height: 32, totalSprites: 20, speed: 24 },
    { id: 3, width: 64, height: 64, totalSprites: 30, speed: 30 },
    { id: 4, width: 128, height: 128, totalSprites: 40, speed: 60 },
  ]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false;
  };

  const handleColorChange = (_value: any, css: string) => {
    setBackgroundColor(css);
    localStorage.setItem("backgroundColor", css);
  };

  const handleSelectChange = (value: string) => {
    const selectedOption = options.find((opt) => opt.id.toString() === value);
    if (selectedOption) {
      setSelectedOptionId(selectedOption.id);
      setSpriteWidth(selectedOption.width);
      setSpriteHeight(selectedOption.height);
      setTotalSprites(selectedOption.totalSprites);
      setAnimationSpeed(selectedOption.speed);
    }
  };

  const splitSpriteSheet = () => {
    if (!imageFile || !spriteWidth || !spriteHeight || !totalSprites) {
      message.error("Please provide all inputs.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = () => {
      const cols = Math.floor(img.width / spriteWidth);
      const canvasSprites: HTMLCanvasElement[] = [];

      for (let i = 0; i < totalSprites; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = spriteWidth;
        canvas.height = spriteHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const x = (i % cols) * spriteWidth;
          const y = Math.floor(i / cols) * spriteHeight;
          ctx.drawImage(
            img,
            x,
            y,
            spriteWidth,
            spriteHeight,
            0,
            0,
            spriteWidth,
            spriteHeight
          );
          canvasSprites.push(canvas);
        }
      }
      setSprites(canvasSprites);
    };
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("backgroundColor");
    if (savedColor) {
      setBackgroundColor(savedColor);
    }

    const savedOptions = localStorage.getItem("options");
    if (savedOptions) {
      setOptions(JSON.parse(savedOptions));
    }
  }, []);

  useEffect(() => {
    if (sprites.length > 0) {
      const interval = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % sprites.length);
      }, 1000 / animationSpeed);
      return () => clearInterval(interval);
    }
  }, [sprites, animationSpeed]);

  const saveOptionsToLocalStorage = (newOptions: any) => {
    localStorage.setItem("options", JSON.stringify(newOptions));
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const openModalEdit = (option: any = null) => {
    setEditingOption(option);
    setModalEditVisible(true);
  };

  const handleSaveOption = (values: any) => {
    let updatedOptions;
    if (editingOption) {
      updatedOptions = options.map((opt) =>
        opt.id === editingOption.id ? { ...opt, ...values } : opt
      );
    } else {
      const newId = uuidv4();
      updatedOptions = [...options, { id: newId, ...values }];
    }
    setOptions(updatedOptions);
    saveOptionsToLocalStorage(updatedOptions);
    setModalEditVisible(false);
    message.success("Option saved successfully!");
  };

  const handleEditOption = (option: any) => {
    openModalEdit(option);
  };

  const handleRemoveOption = (optionId: number) => {
    const updatedOptions = options.filter((opt) => opt.id !== optionId);
    setOptions(updatedOptions);
    saveOptionsToLocalStorage(updatedOptions);
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ flex: 1, padding: 16 }}>
        <div className="title">
          <h1 style={{ textAlign: "center" }}>
            sheet<span style={{ fontSize: "1.6em", color: "blue" }}>2</span>
            show
          </h1>
          <p style={{ textAlign: "center" }}>
            A quick way to test your sprite sheet
            <br />
            and see how it works!
          </p>
        </div>

        <Card>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card style={{ height: "100%" }}>
                <Row gutter={[16, 16]}>
                  <Col
                    span={16}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      {previewUrl && (
                        <Card
                          style={{
                            backgroundColor: backgroundColor,
                            marginBottom: 16,
                          }}
                        >
                          <AntImage
                            style={{ marginBottom: 16 }}
                            src={previewUrl}
                            alt="Uploaded Sprite Sheet"
                          />
                        </Card>
                      )}
                      <Upload
                        beforeUpload={handleImageUpload}
                        showUploadList={false}
                        accept="image/*"
                      >
                        <Button icon={<UploadOutlined />} size="large">
                          Upload Sprite Sheet
                        </Button>
                      </Upload>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        marginBottom: 16,
                      }}
                    >
                      <div style={{ height: 32 }}>
                        <ColorPicker
                          value={backgroundColor}
                          onChange={handleColorChange}
                        />
                      </div>

                      <Form.Item
                        style={{
                          marginLeft: 8,
                          marginBottom: 0,
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <Select
                          value={
                            selectedOptionId !== null
                              ? selectedOptionId.toString()
                              : null
                          }
                          onChange={handleSelectChange}
                          placeholder="Select a preset"
                          dropdownStyle={{
                            minWidth: 400,
                          }}
                        >
                          {options.map((opt) => (
                            <Option key={opt.id} value={opt.id.toString()}>
                              {`Width: ${opt.width}, Height: ${opt.height}, Total Sprites: ${opt.totalSprites}, Speed: ${opt.speed}`}
                            </Option>
                          ))}

                          <Option key="edit" value="edit">
                            <Button
                              type="primary"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent Select from changing its value
                                openModal();
                              }}
                              style={{ width: "100%" }}
                            >
                              Manage Presets
                            </Button>
                          </Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <Form.Item
                      label="Sprite Width"
                      style={{ marginBottom: 16 }}
                    >
                      <Input
                        type="number"
                        placeholder="Sprite Width"
                        value={spriteWidth}
                        onChange={(e) => setSpriteWidth(Number(e.target.value))}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Sprite Height"
                      style={{ marginBottom: 16 }}
                    >
                      <Input
                        type="number"
                        placeholder="Sprite Height"
                        value={spriteHeight}
                        onChange={(e) =>
                          setSpriteHeight(Number(e.target.value))
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label="Total Sprites"
                      style={{ marginBottom: 16 }}
                    >
                      <Input
                        type="number"
                        placeholder="Total Sprites"
                        value={totalSprites}
                        onChange={(e) =>
                          setTotalSprites(Number(e.target.value))
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label="Animation Speed (FPS)"
                      style={{ marginBottom: 16 }}
                    >
                      <Input
                        type="number"
                        placeholder="Animation Speed (FPS)"
                        value={animationSpeed}
                        onChange={(e) =>
                          setAnimationSpeed(Number(e.target.value))
                        }
                      />
                    </Form.Item>
                    <Button
                      style={{ width: "100%" }}
                      size="large"
                      type="primary"
                      onClick={splitSpriteSheet}
                    >
                      Generate Sprites
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                style={{
                  height: "100%",
                  backgroundColor: sprites.length > 0 ? backgroundColor : "",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="animation-container">
                  {sprites.length > 0 ? (
                    <img
                      src={sprites[currentFrame].toDataURL()}
                      alt={`Frame ${currentFrame + 1}`}
                      style={{ width: spriteWidth, height: spriteHeight }}
                    />
                  ) : (
                    <Empty />
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>

      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#001529",
          color: "white",
        }}
      >
        <Text style={{ color: "white" }}>
          <a
            href="https://github.com/minh711"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", fontWeight: "bold" }}
          >
            <GithubOutlined style={{ marginRight: 8 }} />
            Duy Minh Truong (minh711)
          </a>
        </Text>
      </Footer>

      <Modal
        title="Manage Presets"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1200}
      >
        <div>
          <Button
            type="primary"
            onClick={() => openModalEdit(null)}
            style={{ marginBottom: 16 }}
          >
            Add New Option
          </Button>
          <Table
            dataSource={options}
            columns={[
              {
                title: <div style={{ textAlign: "center" }}>Width</div>,
                dataIndex: "width",
                key: "width",
                align: "right",
              },
              {
                title: <div style={{ textAlign: "center" }}>Height</div>,
                dataIndex: "height",
                key: "height",
                align: "right",
              },
              {
                title: <div style={{ textAlign: "center" }}>Total Sprites</div>,
                dataIndex: "totalSprites",
                key: "totalSprites",
                align: "right",
              },
              {
                title: <div style={{ textAlign: "center" }}>Speed</div>,
                dataIndex: "speed",
                key: "speed",
                align: "right",
              },
              {
                title: <div style={{ textAlign: "center" }}>Actions</div>,
                key: "actions",
                render: (record: any) => (
                  <div style={{ textAlign: "center" }}>
                    <Button
                      onClick={() => handleEditOption(record)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to delete this option?"
                      onConfirm={() => handleRemoveOption(record.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  </div>
                ),
              },
            ]}
            rowKey="id"
            pagination={false}
          />
        </div>
      </Modal>

      <Modal
        key={editingOption ? editingOption.id : "new"}
        title={editingOption ? "Edit Option" : "Add Option"}
        open={modalEditVisible}
        onCancel={() => setModalEditVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editingOption}
          onFinish={handleSaveOption}
          layout="vertical"
        >
          <Form.Item
            label="Width"
            name="width"
            rules={[{ required: true, message: "Please input the width!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Height"
            name="height"
            rules={[{ required: true, message: "Please input the height!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Total Sprites"
            name="totalSprites"
            rules={[
              { required: true, message: "Please input the total sprites!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Speed"
            name="speed"
            rules={[{ required: true, message: "Please input the speed!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
}

export default App;
