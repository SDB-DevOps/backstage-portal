import React from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  EntityLayout,
  EntityAboutCard,
  EntityLinksCard,
  EntityHasSystemsCard,
  EntityHasComponentsCard,
  EntitySwitch,
  isComponentType,
} from '@backstage/plugin-catalog';
import {
  EntityArgoCDOverviewCard,
  isArgocdAvailable,
} from '@janus-idp/backstage-plugin-argocd';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6} xs={12}>
      <EntityAboutCard variant="gridItem" />
    </Grid>
    <Grid item md={6} xs={12}>
      <EntityLinksCard />
    </Grid>
    {/* ArgoCD Deployment Status Overview */}
    <EntitySwitch>
      <EntitySwitch.Case if={isArgocdAvailable}>
        <Grid item md={12} xs={12}>
          <EntityArgoCDOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </Grid>
);

const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/docs" title="TechDocs">
      <EntityTechdocsContent />
    </EntityLayout.Route>
    <EntityLayout.Route path="/argocd" title="GitOps Deployment">
      <EntitySwitch>
        <EntitySwitch.Case if={isArgocdAvailable}>
          <EntityArgoCDOverviewCard />
        </EntitySwitch.Case>
        <EntitySwitch.Case>
          <div style={{ padding: 24 }}>
            <h3>ArgoCD GitOps Not Configured</h3>
            <p>Add <code>argocd/app-name: &lt;app-name&gt;</code> to annotations to link this service with ArgoCD.</p>
          </div>
        </EntitySwitch.Case>
      </EntitySwitch>
    </EntityLayout.Route>
  </EntityLayout>
);

const defaultEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/docs" title="TechDocs">
      <EntityTechdocsContent />
    </EntityLayout.Route>
  </EntityLayout>
);

export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isComponentType('service')}>
      {serviceEntityPage}
    </EntitySwitch.Case>
    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
