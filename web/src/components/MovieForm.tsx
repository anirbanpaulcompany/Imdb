import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import movieService, { Movie }  from '../services/movieService';
import './MovieForm.css'; 

interface MovieFormProps {
  initialMovie: any | null; 
  Id: number | null;
}

interface NewProducerData {
  name: string;
  gender: string;
  dob: string;
  bio: string;
}

interface NewActorData {
  name: string;
  gender: string;
  dob: string;
  bio: string;
}


const MovieForm: React.FC<MovieFormProps> = ({ initialMovie, Id }) => {
  const navigate = useNavigate();
  console.log(initialMovie)

    const [formData, setFormData] = useState<Movie>({
      id: initialMovie?.id ?? null,
      name: initialMovie?.name ?? '',
      yearOfRelease: initialMovie?.yearOfRelease ?? '',
      plot: initialMovie?.plot ?? '',
      producerId: initialMovie?.producer?.id ?? null,
      actorIds: initialMovie?.actors?.map((actor: any) => actor.id) ?? [],
      poster: initialMovie?.poster ?? 'default-poster-url',
    });
    

  const [producers, setProducers] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);
  const [newProducerData, setNewProducerData] = useState<NewProducerData>({
    name: '',
    gender: '',
    dob: '',
    bio: '',
  });
  const [newActorData, setNewActorData] = useState<NewActorData>({
    name: '',
    gender: '',
    dob: '',
    bio: '',
  });

  const [stateProducer, setStateProducer] = useState(false);
  const [stateActor, setStateActor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const producersData = await movieService.getAllProducers();
        const actorsData = await movieService.getAllActors();
        setProducers(producersData);
        setActors(actorsData);
      } catch (error) {
        console.error('Error fetching Producers and Actors:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateProducer = async () => {
    try {
      const newProducer = await movieService.createProducer(newProducerData);
      setProducers([...producers, newProducer]);
      setNewProducerData({ name: '', gender: '', dob: '', bio: '' });
      setStateProducer(false);
    } catch (error) {
      console.error('Error creating new producer:', error);
    }
  };

  const handleCreateActor = async () => {
    try {
      const newActor = await movieService.createActor(newActorData);
      setActors([...actors, newActor]);
      setNewActorData({ name: '', gender: '', dob: '', bio: '' });
      setStateActor(false);
    } catch (error) {
      console.error('Error creating new actor:', error);
    }
  };

  const handleProducerSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedProducerId = parseInt(e.target.value);
    setFormData({ ...formData, producerId: selectedProducerId });
  };

  const handleActorSelection = (actorId: number) => {
    const selectedActorIds = [...formData.actorIds];
    if (selectedActorIds.includes(actorId)) {
      const updatedActorIds = selectedActorIds.filter((id) => id !== actorId);
      setFormData({ ...formData, actorIds: updatedActorIds });
    } else {
      setFormData({ ...formData, actorIds: [...selectedActorIds, actorId] });
    }
  };

  const handleStateProducer = () => {
    setStateProducer(!stateProducer);
  };

  const handleStateActor = () => {
    setStateActor(!stateActor);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (initialMovie && Id) {
         await movieService.updateMovie(Id, formData);
      } else {
         await movieService.addMovie(formData);
      }
        navigate('/');
    } catch (error) {
      console.error('Error submitting movie:', error);
    }
  };

  return (
    <div>
      <h2>{initialMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>
          Movie Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br/>
        <label>
          Release Date:
          <input type="date" name="yearOfRelease" value={formData.yearOfRelease} onChange={handleChange} />
        </label>
        <br/>
        <label>
          Plot:
          <textarea name="plot" value={formData.plot} onChange={handleChange} />
        </label>
        <br/>
        <label>
          Producer:
          <select name="producerId" value={formData.producerId || ''} onChange={handleProducerSelection}>
            <option value="">Select Producer</option>
            {producers.map((producer) => (
              <option key={producer.id} value={producer.id}>
                {producer.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleStateProducer}>
            {stateProducer ? 'Close Producer' : 'Create Producer'}
          </button>
          {stateProducer && (
            <div>
              <h3>Create New Producer</h3>
              <input
                type="text"
                placeholder="Name"
                value={newProducerData.name}
                onChange={(e) => setNewProducerData({ ...newProducerData, name: e.target.value })}
              />
              <select
                value={newProducerData.gender}
                onChange={(e) => setNewProducerData({ ...newProducerData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                placeholder="DOB"
                value={newProducerData.dob}
                onChange={(e) => setNewProducerData({ ...newProducerData, dob: e.target.value })}
              />
              <input
                type="text"
                placeholder="Bio"
                value={newProducerData.bio}
                onChange={(e) => setNewProducerData({ ...newProducerData, bio: e.target.value })}
              />
              <button type="button" onClick={handleCreateProducer}>
                Create
              </button>
            </div>
          )}
        </label>
        <br/>
        <label>
          Actors:
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {actors.map((actor) => (
              <label key={actor.id}>
                <input
                  type="checkbox"
                  checked={formData.actorIds.includes(actor.id)}
                  onChange={() => handleActorSelection(actor.id)}
                />
                {actor.name}
              </label>
            ))}
          </div>
          <button type="button" onClick={handleStateActor}>
            {stateActor ? 'Close Actor' : 'Create Actor'}
          </button>
          {stateActor && (
            <div>
              <h3>Create New Actor</h3>
              <input
                type="text"
                placeholder="Name"
                value={newActorData.name}
                onChange={(e) => setNewActorData({ ...newActorData, name: e.target.value })}
              />
              <select
                value={newActorData.gender}
                onChange={(e) => setNewActorData({ ...newActorData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                placeholder="DOB"
                value={newActorData.dob}
                onChange={(e) => setNewActorData({ ...newActorData, dob: e.target.value })}
              />
              <input
                type="text"
                placeholder="Bio"
                value={newActorData.bio}
                onChange={(e) => setNewActorData({ ...newActorData, bio: e.target.value })}
              />
              <br/>
              <button type="button" onClick={handleCreateActor}>
                Create
              </button>
            </div>
          )}
        </label>
        <button type="submit">{initialMovie ? 'Save Changes' : 'Add Movie'}</button>
      </form>
    </div>
  );
};

export default MovieForm;
