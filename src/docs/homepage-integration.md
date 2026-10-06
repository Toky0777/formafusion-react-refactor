# Intégration HomePage avec le système existant

## Vue d'ensemble

Cette documentation explique comment la HomePage CFP a été intégrée avec le système d'API et d'authentification existant du projet.

## Système existant utilisé

### 1. Hook useApi (`src/hooks/Api.jsx`)
- **Fonction** : Gestion des appels API avec états de chargement et d'erreur
- **Token** : Utilise `localStorage.getItem("token")` pour l'authentification
- **Base URL** : `http://127.0.0.1:8000/api`
- **Headers** : Ajoute automatiquement `Authorization: Bearer ${token}`

### 2. Configuration Axios (`src/config/axios.js`)
- **Intercepteurs** : Gestion automatique des erreurs 401
- **Redirection** : Redirige vers `/` en cas d'erreur 401
- **Token** : Utilise `localStorage.getItem("token")`

### 3. Context d'authentification (`src/contexts/AuthContext.jsx`)
- **Gestion utilisateur** : État global de l'utilisateur connecté
- **Token** : Stockage et récupération du token
- **Types d'utilisateur** : Gestion des différents types d'utilisateurs

## Solution implémentée

### 1. Hook useAccueilCfp (`src/hooks/useAccueilCfp.js`)
```javascript
import { useState, useEffect } from 'react';
import useApi from './Api';

export const useAccueilCfp = () => {
  const { loading, error, data, callApi } = useApi();
  const [accueilData, setAccueilData] = useState(null);

  const fetchAccueilData = async () => {
    try {
      const response = await callApi('/accueilCfp');
      setAccueilData(response);
    } catch (err) {
      console.error("Erreur lors du chargement des données d'accueil CFP:", err);
    }
  };

  useEffect(() => {
    fetchAccueilData();
  }, []);

  const refetch = () => {
    fetchAccueilData();
  };

  return {
    data: accueilData,
    loading,
    error,
    refetch
  };
};
```

**Avantages :**
- ✅ Utilise le système d'API existant
- ✅ Gestion automatique de l'authentification
- ✅ États de chargement et d'erreur intégrés
- ✅ Fonction de refetch pour recharger les données

### 2. HomePage (`src/pages/Cfp/home/index.jsx`)
```javascript
import { useAccueilCfp } from "../../../hooks/useAccueilCfp";

export default function HomePage() {
  const { data, loading, error, refetch } = useAccueilCfp();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay onRetry={refetch} />;
  }

  return (
    <div>
      <DailySummary data={data} />
      <ProjectsWidget data={data} />
      <SessionsWidget data={data} />
      <RecentActivity data={data} />
    </div>
  );
}
```

## Gestion des erreurs d'authentification

### Comportement automatique
1. **Token manquant** : Le hook `useApi` ne fait pas l'appel API
2. **Token expiré** : L'intercepteur axios redirige vers `/`
3. **Erreur 401** : Suppression automatique du token et redirection

### Interface utilisateur
- **Chargement** : Spinner pendant la récupération des données
- **Erreur** : Message d'erreur avec bouton "Réessayer"
- **Données** : Affichage des composants avec les données de l'API

## Endpoint API utilisé

```
GET http://127.0.0.1:8000/api/accueilCfp
```

**Headers automatiques :**
```
Authorization: Bearer ${token}
Content-Type: application/json
Accept: application/json
```

## Structure des données attendues

```json
{
  "status": 200,
  "en_cours": 3,
  "total_trained": 0,
  "encaissees": 60262000,
  "impayees": 168549432,
  "nonCloture": 46,
  "today_sessions": [...],
  "encours_projects": [...],
  "reservations": [...]
}
```

## Composants utilisant les données

### 1. DailySummary
- `en_cours` : Projets en cours
- `total_trained` : Apprenants formés
- `encaissees` : Factures encaissées
- `impayees` : Factures impayées
- `nonCloture` : Dossiers non clôturés

### 2. ProjectsWidget
- `encours_projects` : Liste des projets en cours

### 3. SessionsWidget
- `today_sessions` : Sessions du jour

### 4. RecentActivity
- `reservations` : Dernières réservations

## Avantages de cette approche

- ✅ **Intégration native** : Utilise le système existant sans modification
- ✅ **Authentification automatique** : Gestion transparente des tokens
- ✅ **Gestion d'erreurs** : Utilise les intercepteurs existants
- ✅ **Réutilisabilité** : Hook réutilisable pour d'autres composants
- ✅ **Maintenabilité** : Code simple et documenté
- ✅ **Performance** : Pas de duplication de code

## Tests

Le hook est testé avec Jest et React Testing Library :
- Test de récupération réussie des données
- Test de gestion des erreurs API
- Mock du hook useApi existant
