import { useRef, useState } from 'react';
import {
  Select,
  Space,
  Flex,
  Typography,
  Divider,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Result,
} from 'antd';
import { useCrypto } from '../context/crypto-context';
import dayjs from 'dayjs';
import CoinInfo from './CoinInfo';

export default function AddAssetForm({ onClose }) {
  const [coin, setCoin] = useState(null);
  const [submitted, setSubmutted] = useState(false);
  const [form] = Form.useForm();
  const { crypto, addAsset } = useCrypto();
  const assetRef = useRef();

  if (submitted) {
    return (
      <Result
        status="success"
        title="New Asset Added"
        subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
        extra={[
          <Button type="primary" key="console" onClick={onClose}>
            Close
          </Button>,
        ]}
      />
    );
  }

  const validateMessages = {
    required: '${label} is required',
    types: {
      number: '${label} is not valid number',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const handleAmountChange = (value) => {
    const price = form.getFieldValue('price');
    form.setFieldsValue({
      total: +(value * price).toFixed(2),
    });
  };

  const handlePriceChange = (value) => {
    const amount = form.getFieldValue('amount');
    form.setFieldsValue({
      total: +(amount * value).toFixed(2),
    });
  };

  const onFinish = (values) => {
    console.log(values);
    const newAsset = {
      id: coin.id,
      amount: values.amount,
      price: values.price,
      date: values.date?.$d,
    };
    assetRef.current = newAsset;
    addAsset(newAsset);
    setSubmutted(true);
  };

  if (!coin) {
    return (
      <Select
        style={{
          width: '100%',
        }}
        onSelect={(value) => setCoin(crypto.find((coin) => coin.id === value))}
        placeholder="Select coin"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        optionRender={(option) => (
          <Space>
            <img
              style={{ width: 20 }}
              src={option.data.icon}
              alt={option.data.label}
            />{' '}
            {option.data.label}
          </Space>
        )}
      />
    );
  }

  return (
    <Form
      form={form}
      name="basic"
      validateMessages={validateMessages}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 10 }}
      style={{ maxWidth: 600 }}
      initialValues={{
        price: +coin.price.toFixed(2),
        date: dayjs(),
      }}
      onFinish={onFinish}
    >
      <CoinInfo coin={coin} />

      <Divider />

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          {
            required: true,
            type: 'number',
            min: 0,
          },
        ]}
      >
        <InputNumber
          placeholder="Enter coin amount"
          onChange={handleAmountChange}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item label="Price" name="price">
        <InputNumber onChange={handlePriceChange} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Date & Time" name="date">
        <DatePicker showTime />
      </Form.Item>

      <Form.Item label="Total" name="total">
        <InputNumber disabled style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Asset
        </Button>
      </Form.Item>
    </Form>
  );
}
