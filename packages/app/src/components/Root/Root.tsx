import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import LayersIcon from '@material-ui/icons/Layers';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import {
  Sidebar,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';

const useStyles = makeStyles({
  sidebarLogo: {
    height: 36,
    display: 'flex',
    alignItems: 'center',
    margin: '16px 20px',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '18px',
    letterSpacing: '1px',
    textDecoration: 'none',
  },
  logoIcon: {
    marginRight: 10,
    color: '#2196f3',
  },
});

const SidebarLogo = () => {
  const classes = useStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <Link to="/" className={classes.sidebarLogo}>
      <CloudQueueIcon className={classes.logoIcon} />
      {isOpen && <span>SDB IDP</span>}
    </Link>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<LayersIcon />}>
        <SidebarItem icon={HomeIcon} to="catalog" text="Catalog" />
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="TechDocs" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Self-Service Portal" />
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup label="Settings" icon={<SettingsIcon />} to="/settings">
        <SidebarItem icon={SettingsIcon} to="settings" text="Settings" />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
