import { useState, useEffect } from "react";
import Candidate from "../interfaces/Candidate.interface";

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const candidates = JSON.parse(localStorage.getItem("savedCandidates") || "[]");
    setSavedCandidates(candidates);
  }, []);

  const removeCandidate = (login: string) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.login !== login);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates));
  };

  return (
    <main>
      <h1>Potential Candidates</h1>
      {savedCandidates.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name (Username)</th>
              {/* <th>Username</th> */}
              <th>Location</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedCandidates.map((candidate) => (
              <tr key={candidate.login}>
                <td>
                  <img
                    src={candidate.avatar_url}
                    alt={candidate.name || candidate.login}
                    className="avatar"
                    width="50"
                    height="50"
                  />
                </td>
                <td>
                  <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                    {candidate.name || "No name provided"} ({candidate.login})
                  </a>
                </td>
                {/* <td>{candidate.login}</td> */}
                <td>{candidate.location || "Unknown"}</td>
                <td>{candidate.email || "Not provided"}</td>
                <td>{candidate.bio || "Not provided"}</td>
                <td>
                  <button className='reject' onClick={() => removeCandidate(candidate.login)}>-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No saved candidates available.</p>
      )}
    </main>
  );
};

export default SavedCandidates;