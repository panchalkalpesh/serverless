import { Alert, Button, Form, Input, Layout, Typography } from 'antd';
import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

type ShortenLinkResponse = { short_link: string; }
type ShortenLinkError = { error: string; error_description: string; }
type FormValues = { link: string; }

export default function Home() {
  const [status, setStatus] = useState<'initial' | 'error' | 'success'>('initial');
  const [message, setMessage] = useState('');
  const [form] = Form.useForm();

  const onFinish = async ({ link }: FormValues) => {
    try {
      const response = await axios.post<ShortenLinkResponse>('/api/shorten_link', { link });
      setStatus('success');
      setMessage(response.data?.short_link);
    } catch (e) {
      const error = e as AxiosError<ShortenLinkError>;
      setStatus('error');
      setMessage(error.response?.data?.error_description || 'Something went wrong!');
    }
  }

  const onFinishFailed = () => {
    setStatus('error');
    const error = form.getFieldError('link').join(' ');
    setMessage(error);
  }

  return (
    <Layout>
      <Head>
        <title>Link Shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div className={styles.logo}></div>
      </Header>
      <Content className={styles.content}>
        <div className={styles.shortner}>

          <Title level={5}>Copy &amp; Paste the actual link that you wish to shorten</Title>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>

            <div className={styles.linkField}>
              <div className={styles.linkFieldInput}>
                <Form.Item name="link" noStyle rules={[{
                  required: true, message: 'Please paste a valid link', type: 'url'
                }]}>
                  <Input placeholder="https://www.example.com/super-long-link/that-you-wish-to-shorten" size="large" />
                </Form.Item>
              </div>
            </div>

            <div className={styles.linkFieldButton}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Shorten</Button>
              </Form.Item>
            </div>
          </Form>

          {['error', 'success'].includes(status) && (<Alert showIcon message={message} type={status as 'error' | 'success'}></Alert>)}
        </div>
      </Content>
      <Footer className={styles.footer}>
        Link Shortner with Serverless (LSS) &copy; 2021
      </Footer>
    </Layout>
  )
}
