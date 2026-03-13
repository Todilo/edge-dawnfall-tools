import "./App.css";

import { Layout, Typography } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import DeckPage from "./pages/deck-page";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Header className="header-container">
            <Title
              style={{ color: "white", textAlign: "left", padding: "0 20px" }}
              level={3}
            >
              Edge Dawnfall Toolbox
            </Title>
          </Header>
          <Layout>
            <Layout style={{ padding: 0 }}>
              <Content>
                <Routes>
                  <Route path="/" element={<DeckPage />} />
                  <Route path="/deck" element={<DeckPage readonly />} />
                </Routes>
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Edge Dawnfall Toolbox Created by Todilo. Post any feedback to
                todilo87+edgedawnfall (at) gmail . com
              </Footer>
            </Layout>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}
