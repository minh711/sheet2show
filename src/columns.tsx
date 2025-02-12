import { Button, Popconfirm, TableProps } from "antd";

interface Option {
  id: number;
  width: number;
  height: number;
  totalSprites: number;
  speed: number;
}

interface ColumnsProps {
  onEdit: (record: Option) => void;
  onDelete: (id: number) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: ColumnsProps): TableProps<Option>["columns"] => [
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
    render: (record: Option) => (
      <div style={{ textAlign: "center" }}>
        <Button onClick={() => onEdit(record)} style={{ marginRight: 8 }}>
          Edit
        </Button>
        <Popconfirm
          title="Are you sure you want to delete this option?"
          onConfirm={() => onDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      </div>
    ),
  },
];
