import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { FETCH_BY_ID, FETCH_RECOMMENDATIONS } from '../../lib/API/request';
import { IMovie, IMoviePage } from '../../types/interface';
import Head from 'next/head';
import Hero from '../../components/FilmPage/Hero';
import VideoPlayer from '../../components/VideoPlayer';
import VideoPlaceholder from '../../components/VideoPlaceholder';
import Cards from '../../components/FilmPage/Cards';

interface Props {
  filmData: IMoviePage;
}

export interface IPlaceholder {
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  play: boolean;
}

const Film: React.FC<Props> = ({ filmData }) => {
  const [play, setPlay] = useState(false);
  const [recommended, setRecommended] = useState<IMovie[] | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(FETCH_RECOMMENDATIONS(String(filmData.id)));
      const json = await res.json();
      setRecommended(json.results);
      return json;
    })();
  }, [filmData.id]);

  return (
    <>
      <Head>
        <title>{filmData.title}</title>
        <meta name="description" content={filmData.overview} />
      </Head>
      <Hero data={filmData} play={play} setPlay={setPlay} />
      <div className="w-11/12 sm:w-4/5  xl:w-2/3 mx-auto mt-4 ">
        {filmData.genres.map((genre) => {
          return (
            <button
              key={genre.id}
              className="p-1 mr-2 cursor-pointer bg-red-200 rounded-md uppercase text-xs "
            >
              {genre.name}
            </button>
          );
        })}
        <div className="flex items-center mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 mr-1 ${
              !play ? 'text-gray-400' : 'text-green-400'
            } transition-colors duration-200`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p
            className={`text-sm  ${
              !play ? 'text-gray-400' : 'text-green-400'
            } font-semibold`}
          >
            {play
              ? `${
                  filmData.title || filmData.original_title
                } trailer playing...`
              : `${filmData.title || filmData.original_title} trailer`}
          </p>
        </div>
      </div>
      {!play && <VideoPlaceholder play={play} setPlay={setPlay} />}
      {play && (
        <VideoPlayer title={filmData.title || filmData.original_title} />
      )}

      <Cards data={recommended} name="Recommended" />

      <div className="w-11/12 md:w-4/5 xl:w-2/3 mx-auto flex mt-4 flex-wrap">
        {filmData.production_companies.map((production) => {
          return (
            <p className="text-xs mr-1" key={production.id}>
              {production.name}
            </p>
          );
        })}
      </div>
      <div></div>
    </>
  );
};

export default Film;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const getData = async (url: string) => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      return json;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const filmData = await getData(FETCH_BY_ID(params?.id));

  return {
    props: {
      filmData,
    },
  };
};
