import { useState, useEffect } from "react";
import Candidate from "../interfaces/Candidate.interface";
import { IoRemoveCircle } from 'react-icons/io5';

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
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Bio</th>
              <th>Reject</th>
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
                <td>{candidate.location || "Unknown"}</td>
                <td>{candidate.email || "Not provided"}</td>
                <td>{candidate.company || "Not Provided"}</td>
                <td>{candidate.bio || "Not provided"}</td>
                <td>
                  <IoRemoveCircle  style={{ fontSize: '75px', cursor: 'pointer', color: '#ff0000'}} onClick={() => removeCandidate(candidate.login)} />
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