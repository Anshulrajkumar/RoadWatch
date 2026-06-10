export const useGeolocation = () => {
  const getCurrentLocation = (options = {}) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const logMsg = `STAGE_1_RAW_GPS_lat_${position.coords.latitude}_lng_${position.coords.longitude}`;
          fetch(`http://localhost:4000/api/health?log=${logMsg}`).catch(()=>({}));
          resolve(position.coords);
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          ...options,
        }
      );
    });
  };

  return { getCurrentLocation };
};
