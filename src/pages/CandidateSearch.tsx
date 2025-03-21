import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import Candidate from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>(
    JSON.parse(localStorage.getItem('savedCandidates') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('candidates', JSON.stringify(savedCandidates));
  }, [savedCandidates]);

  useEffect(() => {
    fetchRandomCandidates();
  }
  , []);

  const fetchRandomCandidates = async () => {
    setLoading(true);
    try {
      const randomCandidates = await searchGithub();
      if (randomCandidates && randomCandidates.length > 0) {
        const firstCandidate = randomCandidates[0];
        const fullCandidate = await searchGithubUser(firstCandidate.login); 
        setCandidate(fullCandidate);
      } else {
        setCandidate(null);
      }
    } catch (err) {
      console.log('an error occurred while fetching a random candidate', err);
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };
  
  const searchForGithubUser = async (query: string) => {
    setLoading(true);
    try {
      if (query.trim() !== '') {
        const user = await searchGithubUser(query);
        if (user.login) {
          setCandidate(user);
        } else {
          setCandidate(null);
        }
      }else{
        fetchRandomCandidates();
    }
    }catch (err) {
      console.log('an error occurred while searching for Github user', err);
      setCandidate(null);
    } finally {
        setLoading(false);
    }
  };

  const saveCandidate = () => {
    if (candidate) {
      const updatedCandidates = [...savedCandidates, candidate];
      setSavedCandidates(updatedCandidates);
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    }
    fetchRandomCandidates();
  };

  const skipCandidate = () => {
    fetchRandomCandidates();
  };

  return (
    <main>
    <h1>Candidate Search</h1>
    <div>
      <input 
        type="text"
        placeholder='Search for a Github user'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          searchForGithubUser(e.target.value);  
        }}
        />
    </div>

    {loading ? (
      <p>Loading...</p>
    ): candidate ? (
        <div className="card">
          <img src={candidate.avatar_url} alt={candidate.name} className='avatar'/>
          <div className='card-content'></div>
            <h2>{candidate.name || 'No name provided'} (@{candidate.login})</h2>
            <p>Location: {candidate.location || 'Unknown'}</p>
            <p>Company: {candidate.company || 'Not Provided'}</p>
            <p>Email: {candidate.email || 'Not Provided'}</p>
            <p className='bio'>Bio: {candidate.bio || 'Not Provided'}</p>
            <a href={candidate.html_url}>Github Profile</a>
            <div>
              <button className='accept' onClick={saveCandidate}>+</button>
              <button className='reject' onClick={skipCandidate}>-</button>
            </div>
        </div>
      ) : (
        <p>No candidates found</p>
      )
      }
  </main>
  );
};

export default CandidateSearch;
