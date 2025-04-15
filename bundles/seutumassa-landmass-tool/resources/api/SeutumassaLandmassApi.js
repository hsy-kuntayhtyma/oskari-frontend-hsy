const landmassConfigActionRoute = Oskari.urls.getRoute('LandmassConfig');
const landmassAreaActionRoute = Oskari.urls.getRoute('LandmassArea');
const landmassProjectActionRoute = Oskari.urls.getRoute('LandmassProject');
const landmassUsersActionRoute = Oskari.urls.getRoute('LandmassUsers');

export function getLandmassConfig() {
  return fetch(landmassConfigActionRoute);
}

export function getLandmassAreaByCoordinate(lon, lat) {
  return fetch(landmassAreaActionRoute + `&lon=${lon}&lat=${lat}`);
}

export function addLandmassArea(area) {
  return fetch(landmassAreaActionRoute, {
    method: 'POST',
    body: JSON.stringify(area),
  });
}

export function updateLandmassArea(area) {
  return fetch(landmassAreaActionRoute, {
    method: 'PUT',
    body: JSON.stringify(area),
  });
}

export function deleteLandmassAreaById(id) {
  return fetch(landmassAreaActionRoute + `&id=${id}`, {
    method: 'DELETE'
  });
}

export function getLandmassProjects() {
  return fetch(landmassProjectActionRoute);
}

export function getLandmassUsers() {
  return fetch(landmassUsersActionRoute);
}

export function addLandmassProject(project) {
  return fetch(landmassProjectActionRoute, {
    method: 'POST',
    body: JSON.stringify(project),
  });
}

export function updateLandmassProject(project) {
  return fetch(landmassProjectActionRoute, {
    method: 'PUT',
    body: JSON.stringify(project),
  });
}

export function deleteLandmassProjectById(id) {
  return fetch(landmassProjectActionRoute + `&id=${id}`, {
    method: 'DELETE'
  });
}
