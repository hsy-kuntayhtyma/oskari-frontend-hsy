import React, { useState, useEffect } from "react";
import { Select } from 'oskari-ui';
import { PrimaryButton, SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { Content, GappedContent, Block, Button, StyledLabel, StyledTextInput, LabelledField } from './styled.jsx';

/* API */
import {
  getLandmassProjects,
  getLandmassUsers,
  addLandmassProject,
  updateLandmassProject,
  deleteLandmassProjectById
} from '../../resources/api/SeutumassaLandmassApi.js';

const ProjectManager = ({ resetHandler, config }) => {

  const [municipalities, setMunicipalities] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectUnderEdit, setProjectUnderEdit] = useState();

  useEffect(() => {
    (async () => {
      await fetchProjects();
      await fetchUsers();
    })();
  }, []);

  useEffect(() => {
    const m = config?.municipalities?.map(m => ({
      value: m.id,
      label: m.label
    })) ?? [];
    setMunicipalities(m);
  }, [config]);

  async function fetchProjects() {
    try {
      const resp = await getLandmassProjects();
      const json = await resp.json();
      setProjects(json);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchUsers() {
    try {
      const resp = await getLandmassUsers();
      const json = await resp.json();
      setUsers(json);
    } catch (e) {
      console.error(e);
    }
  }

  async function saveProjectUnderEdit() {
    try {
      const fn = projectUnderEdit.id ? updateLandmassProject : addLandmassProject;
      await fn(projectUnderEdit);
      await fetchProjects();
      setProjectUnderEdit(null);
    } catch (e) {
      console.error(e);
    }
  }


  async function deleteProject(id) {
    try {
      await deleteLandmassProjectById(id);
      await fetchProjects();
    } catch (e) {
      console.error(e);
    }
  }

  return (
  <>
    {!projectUnderEdit &&
    <GappedContent>
      <Block>
        <span>Lisää uusi hankealue</span>
        <Button
          type='add'
          bordered
          onClick={() => setProjectUnderEdit({ id: null, nimi: null, kunta: municipalities.length === 1 ? municipalities[0].value : null, editors: [], managers: [] })}
        />
      </Block>
      <Content>
        {projects.length > 0 && projects.map(item => {
          const { id, nimi, kunta } = item;
          const kuntaLabel = municipalities.find(x => x.value === kunta)?.label ?? '?';
          return (
            <Block key={id}>
              <span>{nimi} ({kuntaLabel})</span>
              <ButtonContainer>
                <Button type='edit' onClick={() => setProjectUnderEdit(item)} />
                <Button type='delete' onConfirm={() => deleteProject(id)} />
              </ButtonContainer>
            </Block>
          );
        })}
      </Content>
      {(!projects || projects.length === 0) && <span>Ei hankealueita</span>}
      <ButtonContainer>
        <SecondaryButton
          type='previous'
          onClick={resetHandler}
        />
      </ButtonContainer>
    </GappedContent>
    }
    {projectUnderEdit &&
    <Content>
      <LabelledField>
        <StyledLabel>Kunta</StyledLabel>
        <Select
          labelInValue
          // Capture the target value to avoid issues with SyntheticEvents
          onChange={(value) => { const v = value.value; setProjectUnderEdit(old => ({...old, kunta: v })) }}
          options={municipalities}
          disabled={municipalities.length < 2}          
          value={projectUnderEdit.kunta ?? ''}
          style={ { width: 210 } }
        />
      </LabelledField>
      <LabelledField>
        <StyledLabel>Nimi</StyledLabel>
        <StyledTextInput
          value={projectUnderEdit.nimi ?? ''}
          // Capture the target value to avoid issues with SyntheticEvents
          onChange={(e) => { const v = e.target.value; setProjectUnderEdit(old => ({...old, nimi: v })) }}
          type='text'
          autoComplete='nope'
        />
      </LabelledField>
      <LabelledField>
        <StyledLabel>Editoijat</StyledLabel>
        <Select
          mode='multiple'
          disabled={!projectUnderEdit.kunta}
          // Capture the target value to avoid issues with SyntheticEvents
          onChange={(value) => { setProjectUnderEdit(old => ({...old, editors: value })) }}
          options={!projectUnderEdit.kunta ? [] : users[projectUnderEdit.kunta].map(x => ({ value: x.id, label: x.nickName }))}
          value={projectUnderEdit.editors ?? []}
          style={ { width: 210 } }
        />
      </LabelledField>
      <LabelledField>
        <StyledLabel>Managerit</StyledLabel>
        <Select
          mode='multiple'
          disabled={!projectUnderEdit.kunta}
          // Capture the target value to avoid issues with SyntheticEvents
          onChange={(value) => { setProjectUnderEdit(old => ({...old, managers: value })) }}
          options={!projectUnderEdit.kunta ? [] : users[projectUnderEdit.kunta].map(x => ({ value: x.id, label: x.nickName }))}
          value={projectUnderEdit.managers ?? []}
          style={ { width: 210 } }
        />
      </LabelledField>
      <ButtonContainer>
        <SecondaryButton
          type='cancel'
          onClick={() => setProjectUnderEdit(null)}
        />
        <PrimaryButton
          disabled={!projectUnderEdit.nimi?.length || !projectUnderEdit.kunta?.length}
          type='save'
          onClick={saveProjectUnderEdit}
        />
      </ButtonContainer>
    </Content>
    }
  </>
  )
};

export default ProjectManager;
