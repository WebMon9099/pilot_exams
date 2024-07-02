import Notiflix from 'notiflix';

function useLoadingScreen(loading: boolean) {
  if (loading) Notiflix.Loading.standard({ svgColor: '#00acdd' });
  else Notiflix.Loading.remove();
}

export default useLoadingScreen;
