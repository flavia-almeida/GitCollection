import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {Header,RepoInfo,Issues} from './styles';
import logo from '../../assets/logo.svg';
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import {api} from '../../services/api';

interface RepositoryParams {
  repository : string;
}

interface GithubRepository{
  full_name: string;
  description: string;
  forks_count: number;
  open_issues_count: number;
  stargazers_count: number;
  owner: {
      login: string;
      avatar_url: string;
  };
}

interface GithubIssue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  }
}

export const Repo: React.FC = () => {
  const [repository, setRepository] = React.useState<GithubRepository | null>(null);
  const [issues_list, setIssues] = React.useState<GithubIssue[]>([]);

  const {params} = useRouteMatch<RepositoryParams>();
  React.useEffect(() => {
    api.get(`repos/${params.repository}`).then(response => setRepository(response.data))
    api.get(`repos/${params.repository}/issues`).then(response => setIssues(response.data))
  },[params.repository]);

  return (
    <>
      <Header>
        <img src = {logo} alt = "GitCollection" />
        <Link to = "/">
          <FiChevronLeft size={20}/>
          Voltar
        </Link>
        
      </Header>

      {repository && (
        <RepoInfo>
          <header>
            <img src = {repository.owner.avatar_url} alt = {repository.owner.login} />
            <div>
              <strong>{repository.owner.login}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepoInfo>
      )}     

      <Issues>
        {issues_list.map(item => (
          <a href = {item.html_url} key = {item.id}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.user.login}</p>
            </div>
            <FiChevronRight size={20}/>
          </a>
        ))}
      </Issues>
    </>
  );
};
