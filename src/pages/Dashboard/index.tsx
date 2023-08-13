import React from 'react';
import { Title, Form, Repos, Error } from './styles';
import logo from '../../assets/logo.svg';
import {FiChevronRight} from 'react-icons/fi';
import {api} from '../../services/api';
import {Link} from 'react-router-dom';


interface GithubRepository{
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}


export const Dashboard: React.FC = () => {
    var exists_repo : boolean;
    const [repos,setRepos] = React.useState<GithubRepository[]>(() => {
        const storageRepos= localStorage.getItem('@GitCollection:repositories')
        if (storageRepos) {
            return JSON.parse(storageRepos);
        }
        return [];
    });
    const [newRepo,setNewRepo] = React.useState('');
    const [inputError, setInputError] = React.useState('');
    const formEl = React.useRef<HTMLFormElement | null>(null);


    React.useEffect(()=>{
        localStorage.setItem('@GitCollection:repositories',JSON.stringify(repos));
    },[repos]);


    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) : void {
        if (event.target.value) {
            setNewRepo(event.target.value);
        }
    }

    async function handleSearchRepo(event: React.FormEvent<HTMLFormElement>,): Promise<void> {
        exists_repo = false
        event.preventDefault();
        if(!newRepo) {
            setInputError('Informe o username/repositório');
            return;
        } else {
            repos.forEach((repo) => {
                if (repo.full_name == newRepo) {
                    setInputError('Repositório informado já adicionado');
                    exists_repo = true
                }
            });
        }
        if(!exists_repo) {
            try{
                setInputError('');
                const response = await api.get<GithubRepository>(`repos/${newRepo}`);
                const repository = response.data;

                setRepos([...repos, repository]);
                formEl.current?.reset();
                formEl.current?.focus();
                setNewRepo('');
            }catch{
                setInputError('Não foi possível encontrar o repositório informado.');
            }
        }        
    }

    return (
    <>
        <img src = {logo} alt = "GitCollection"/>
        <Title>Catálogo de repositórios do GitHub</Title>

        <Form ref= {formEl} hasError={Boolean(inputError)} onSubmit={handleSearchRepo}>
            <input 
            placeholder="username/repository_name" 
            onChange={handleInputChange}
            />

            <button type="submit">Buscar</button>
        </Form>

        {inputError && <Error>{inputError}</Error>}

        <Repos>
            {repos.map(repository => (
                <Link to = {`/repositories/${repository.full_name}`} key={repository.full_name} >
                    <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20}/>
                </Link>
            ))}

            
        </Repos>
    </>
    );
};
