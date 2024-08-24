import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ContentLoader from 'react-content-loader';
import { FaSearch, FaPlayCircle, FaPauseCircle, FaVolumeUp, FaList, FaForward, FaBackward, FaEllipsisH, FaBars } from 'react-icons/fa';


const Playlist = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('forYou');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio());

 
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSong) {
      audioRef.current.src = selectedSong.url;
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      audioRef.current.ontimeupdate = updateProgress;
    }
  }, [selectedSong, isPlaying]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://cms.samespace.com/items/songs');
      setSongs(response.data.data);
      setSelectedSong(response.data.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
  };

  const filteredSongs = songs.filter((song) => {
    if (filter === 'forYou') {
      return true;
    } else if (filter === 'topTracks') {
      return song.top_track === true;
    }
    return true;
  });

  const searchedSongs = filteredSongs.filter((song) => {
    return (
      song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setIsPlaying(true);
    setProgress(0);
    if (window.innerWidth < 768) {
      setShowPlaylist(false);
    }
  };

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  const toggleMenu = () => {
     setShowPlaylist(!showPlaylist);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevSong = () => {
    const currentIndex = songs.findIndex(song => song.id === selectedSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setSelectedSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleNextSong = () => {
    const currentIndex = songs.findIndex(song => song.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setSelectedSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const updateProgress = () => {
    const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(currentProgress);
  };

  

  const HeaderSkeleton = () => (
    <ContentLoader width={400} height={50} viewBox="0 0 400 50">
      <rect x="0" y="10" rx="4" ry="4" width="100" height="30" />
      <rect x="350" y="10" rx="4" ry="4" width="30" height="30" />
    </ContentLoader>
  );

  const PlaylistSkeleton = () => (
    <ContentLoader width={400} height={400} viewBox="0 0 400 400">
      <rect x="0" y="10" rx="4" ry="4" width="100" height="20" />
      <rect x="120" y="10" rx="4" ry="4" width="100" height="20" />
      <rect x="0" y="50" rx="4" ry="4" width="400" height="30" />
      {[...Array(5)].map((_, i) => (
        <React.Fragment key={i}>
          <rect x="0" y={100 + i * 60} rx="4" ry="4" width="50" height="50" />
          <rect x="60" y={100 + i * 60} rx="4" ry="4" width="200" height="20" />
          <rect x="60" y={125 + i * 60} rx="4" ry="4" width="150" height="15" />
        </React.Fragment>
      ))}
    </ContentLoader>
  );

  const PlayerSkeleton = () => (
    <ContentLoader width={400} height={400} viewBox="0 0 400 400">
      <rect x="100" y="20" rx="4" ry="4" width="200" height="20" />
      <rect x="150" y="50" rx="4" ry="4" width="100" height="15" />
      <rect x="50" y="80" rx="10" ry="10" width="300" height="300" />
      <rect x="0" y="390" rx="4" ry="4" width="400" height="10" />
      {[...Array(5)].map((_, i) => (
        <circle key={i} cx={80 + i * 60} cy="420" r="20" />
      ))}
    </ContentLoader>
  );

  const LoadingSkeleton = () => (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="w-full p-4">
        <HeaderSkeleton />
      </div>
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
          <PlaylistSkeleton />
        </div>
        <div className="flex-1 flex justify-center items-center p-4">
          <PlayerSkeleton />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }
return (
  <div className='h-screen flex flex-col' style={{ backgroundColor: selectedSong ? selectedSong.accent : 'black' }}>
 
  <div className='w-full p-4 bg-black' style={{ backgroundColor: selectedSong ? selectedSong.accent : 'black' }}>
    <div className="flex justify-between items-center">
      <img src="image.svg" alt="Logo" className="w-24 h-8" />
      <button className="md:hidden text-white" onClick={toggleMenu}>
        <FaBars />
      </button>    
    </div>
  </div>
  <div className='flex-1 flex flex-col md:flex-row overflow-hidden'>
   
    <div className={`w-full md:w-1/3 lg:w-1/4 ml-0 sm:ml-48 bg-opacity-50 overflow-y-auto ${showPlaylist || window.innerWidth >= 768 ? 'block' : 'hidden'}`}>
      <div className="p-4">
        <div className="mb-6 flex">
          <h1
            className={`text-lg font-semibold cursor-pointer ${filter === 'forYou' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => handleFilterChange('forYou')}
          >
            For You
          </h1>
          <h1
            className={`text-lg ml-6 font-semibold cursor-pointer ${filter === 'topTracks' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => handleFilterChange('topTracks')}
          >
            Top Tracks
          </h1>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search Songs, Artist"
            className="w-full h-10 pr-10 bg-black rounded-lg p-2 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute inset-y-0 right-3 text-gray-500 top-1/2 transform -translate-y-1/2" />
        </div>

        <div className="space-y-1">
          {searchedSongs.length > 0 ? (
            searchedSongs.map((song) => (
              <div
                key={song.id}
                className={`flex items-center justify-between rounded-lg cursor-pointer p-2 ${selectedSong?.id === song.id ? 'bg-gray-900' : 'hover:bg-gray-900 '}`}
                onClick={() => handleSongSelect(song)}
              >
                <div className="flex items-center">
                  <img
                    src={`https://cms.samespace.com/assets/${song.cover}`}
                    alt={song.title}
                    className="w-10 h-10 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h2 className="text-sm text-white font-bold">{song.name}</h2>
                    <p className="text-gray-400 text-xs">{song.artist}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No songs found.</p>
          )}
        </div>
      </div>
    </div>
    <div className="flex-1 flex flex-col justify-center items-center p-4 bg-black" style={{ backgroundColor: selectedSong ? selectedSong.accent : 'black' }}>
      {selectedSong && (
        <>
          <div className=" flex flex-col -ml-[12vw] mb-4">
            <h2 className="text-2xl flex text-white font-bold">{selectedSong.name}</h2>
            <p className="text-gray-300">{selectedSong.artist}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
              alt={selectedSong.title}
              className="w-64 h-64 md:w-80 md:h-80 rounded-lg object-cover mb-4"
            />
            <div className="flex justify-center w-full text-white text-sm mt-4">
              <div className="w-full h-2 bg-gray-800 rounded-lg overflow-hidden mx-2">
                <div
                  className="h-full bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{selectedSong.duration}</span>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-4 gpa sm:space-x-12 mt-4">
            
            <FaEllipsisH className="text-white text-xl md:text-2xl cursor-pointer" />
            <FaBackward className="text-white text-xl md:text-2xl cursor-pointer" onClick={handlePrevSong} />
            <button onClick={handlePlayPause} className="text-white text-2xl md:text-3xl">
              {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
            </button>
            <FaForward className="text-white text-xl md:text-2xl cursor-pointer" onClick={handleNextSong} />
            <FaVolumeUp className="text-white text-xl md:text-2xl" />
          </div>
        </>
      )}
    </div>
  </div>
  <img
    src="sai.png"
    alt="profile"
    className="w-8 h-8 rounded-full fixed bottom-4 left-4"
  />
</div>
);
}
export default Playlist