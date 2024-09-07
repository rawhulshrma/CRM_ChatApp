import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Button, Tooltip, Progress, Tag, Modal, Input, Form, message } from 'antd';
import { LogoutOutlined, EditOutlined, TrophyOutlined, BookOutlined, HeartOutlined } from '@ant-design/icons';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { update, logout } from '../../action/auth/authAction';

const { Title, Text } = Typography;

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(6),
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.15)',
  borderRadius: 16,
  padding: 32,
  background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-10px)',
  },
}));

const ContentWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 32,
});

const InfoWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 32,
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '14px 28px',
  fontSize: 16,
  fontWeight: 600,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-3px)',
  },
}));

const StatsWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 24,
  marginBottom: 24,
});

const StatItem = styled('div')({
  textAlign: 'center',
});

const TagsWrapper = styled('div')({
  marginTop: 16,
  '& .ant-tag': {
    margin: 4,
    padding: '4px 8px',
    borderRadius: 8,
  },
});

const StyledModal = styled(Modal)({
  '& .ant-modal-content': {
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
  },
});

const ImagePreview = styled('img')({
  width: '100%',
  maxHeight: '200px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginTop: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

const AuthProfileCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [imageFile, setImageFile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error('Image size should not exceed 5MB!');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getProfileImageUrl = (avatar) => {
    if (!avatar) {
      return 'default-admin-image-url'; // Replace with actual default image URL
    }
    return avatar.startsWith('http') ? avatar : `http://localhost:8080/${avatar.replace(/\\/g, '/')}`;
  };

  const onFinish = (values) => {
    const updatedUser = {
      ...values,
      avatar: imagePreview || user.avatar
    };
    dispatch(update(updatedUser));
    setIsModalVisible(false);
    form.resetFields();
    setImagePreview(null);
  };

  return (
    <>
      <StyledCard
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ContentWrapper>
          <InfoWrapper>
            <Title level={3} style={{ marginBottom: 4 }}>
              {`Name: ${user?.name || 'Guest'}!`}
            </Title>
            <Text strong style={{ fontSize: 20, marginBottom: 12 }}>
              {user?.email || 'Email not available'}
            </Text>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Senior Software Engineer
            </Text>
            <TagsWrapper>
              <Tag color="orange" style={{ fontSize: '16px', textTransform: 'capitalize' }}>
                {user?.role || 'Role not available'}
              </Tag>
            </TagsWrapper>
          </InfoWrapper>
          <Tooltip title="Click to change profile picture" placement="left">
            <Avatar
              size={230}
              src={getProfileImageUrl(user?.avatar)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isHovered ? '0 0 20px rgba(0,0,0,0.3)' : 'none',
              }}
            />
          </Tooltip>
        </ContentWrapper>
        
        <Progress
          percent={75}
          status="active"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          style={{ marginBottom: 24 }}
        />
        
        <StatsWrapper>
          <Tooltip title="Projects Completed">
            <StatItem>
              <TrophyOutlined style={{ fontSize: 24, color: '#faad14' }} />
              <Text strong style={{ display: 'block', marginTop: 8 }}>23</Text>
              <Text type="secondary">Projects</Text>
            </StatItem>
          </Tooltip>
          <Tooltip title="Courses Completed">
            <StatItem>
              <BookOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <Text strong style={{ display: 'block', marginTop: 8 }}>15</Text>
              <Text type="secondary">Courses</Text>
            </StatItem>
          </Tooltip>
          <Tooltip title="Endorsements">
            <StatItem>
              <HeartOutlined style={{ fontSize: 24, color: '#f5222d' }} />
              <Text strong style={{ display: 'block', marginTop: 8 }}>142</Text>
              <Text type="secondary">Likes</Text>
            </StatItem>
          </Tooltip>
        </StatsWrapper>

        <ButtonWrapper>
          <StyledButton type="primary" icon={<EditOutlined />} onClick={showModal}>
            Update Profile
          </StyledButton>
          <StyledButton danger icon={<LogoutOutlined />} onClick={() => dispatch(logout())}>
            Logout
          </StyledButton>
        </ButtonWrapper>
      </StyledCard>

      <StyledModal
        title="Update Profile"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Update"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Profile Picture">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && <ImagePreview src={getProfileImageUrl} alt="Profile Preview" />}
          </Form.Item>
        </Form>
      </StyledModal>
    </>
  );
};

export default AuthProfileCard;
