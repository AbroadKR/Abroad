import Axios from 'axios';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import SearchBar from '../Components/Community/SearchBar';
import Pagination from '../Components/Community/Pagination';
import AriticleList from '../Components/Community/ArticleList';

export default function Community() {
  const [article, setArticle] = useState([]);
  const API_URL =
    'http://makeup-api.herokuapp.com/api/v1/products.json?brand=Dior';

  function getData() {
    Axios.get(API_URL) //
      .then((res) => {
        setArticle(res.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <CommunityWrap>
      <UpstreamSection>
        <span>커뮤니티</span>
        <span>자유게시판</span>
      </UpstreamSection>
      <ListSorting>
        <button>최신순</button>
        <button>댓글순</button>
        <button>좋아요순</button>
      </ListSorting>
      <AriticleList article={article.slice(0, 15)} />
      <Pagination />
      <SearchBar />
    </CommunityWrap>
  );
}

const CommunityWrap = styled.div`
  width: 71vw;
  height: 100%;
  margin: 3.5em auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UpstreamSection = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 3em;
  background-color: #66a6ff;
  color: white;
  padding-left: 2em;
  & > span:first-child::after {
    content: '|';
    margin: 0 5px;
  }
  & > span:last-child {
    font-weight: 900;
  }
`;

const ListSorting = styled.div`
  width: 100%;
  height: 3.5em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1.5px solid #444444;
  & > button:first-child::after {
    content: '|';
    margin-left: 10px;
  }
  & > button:last-child::before {
    content: '|';
    margin-right: 10px;
  }

  & > button:hover {
    opacity: 0.7;
  }

  & > button:focus {
    color: #66a6ff;
  }
`;