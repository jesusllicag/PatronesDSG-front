import { Injectable, signal, computed } from '@angular/core';
import { Community, Subcommunity, Collection, CommunityCreate, SubcommunityCreate, CollectionCreate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  // Mock data signals
  private communitiesData = signal<Community[]>([
    {
      id: 1,
      name: 'Pregrado',
      description: 'Comunidad de trabajos de grado y tesis de pregrado de todas las facultades',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Postgrado',
      description: 'Comunidad de investigaciones y tesis de maestrías y doctorados',
      createdAt: new Date('2024-02-20'),
    },
    {
      id: 3,
      name: 'Investigación',
      description: 'Comunidad de proyectos de investigación institucional',
      createdAt: new Date('2024-03-10'),
    },
  ]);

  private subcommunitiesData = signal<Subcommunity[]>([
    // Pregrado subcommunities
    {
      id: 1,
      name: 'Tesis de Grado',
      description: 'Trabajos finales de grado de todas las carreras',
      communityId: 1,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: 2,
      name: 'Proyectos de Investigación',
      description: 'Proyectos de investigación formativa de pregrado',
      communityId: 1,
      createdAt: new Date('2024-01-25'),
    },
    {
      id: 3,
      name: 'Prácticas Profesionales',
      description: 'Informes de prácticas profesionales',
      communityId: 1,
      createdAt: new Date('2024-02-01'),
    },
    // Postgrado subcommunities
    {
      id: 4,
      name: 'Maestrías',
      description: 'Tesis y trabajos de maestría',
      communityId: 2,
      createdAt: new Date('2024-02-25'),
    },
    {
      id: 5,
      name: 'Doctorados',
      description: 'Tesis doctorales y publicaciones',
      communityId: 2,
      createdAt: new Date('2024-03-01'),
    },
    {
      id: 6,
      name: 'Especializaciones',
      description: 'Trabajos de especialización',
      communityId: 2,
      createdAt: new Date('2024-03-05'),
    },
    // Investigación subcommunities
    {
      id: 7,
      name: 'Grupos de Investigación',
      description: 'Producción de grupos de investigación reconocidos',
      communityId: 3,
      createdAt: new Date('2024-03-15'),
    },
    {
      id: 8,
      name: 'Semilleros',
      description: 'Producción de semilleros de investigación',
      communityId: 3,
      createdAt: new Date('2024-03-20'),
    },
  ]);

  private collectionsData = signal<Collection[]>([
    // Tesis de Grado collections
    {
      id: 1,
      name: 'Ingeniería de Sistemas',
      description: 'Tesis de la carrera de Ingeniería de Sistemas',
      subcommunityId: 1,
      itemCount: 45,
      createdAt: new Date('2024-01-22'),
    },
    {
      id: 2,
      name: 'Ingeniería Civil',
      description: 'Tesis de la carrera de Ingeniería Civil',
      subcommunityId: 1,
      itemCount: 32,
      createdAt: new Date('2024-01-23'),
    },
    {
      id: 3,
      name: 'Administración de Empresas',
      description: 'Tesis de la carrera de Administración',
      subcommunityId: 1,
      itemCount: 28,
      createdAt: new Date('2024-01-24'),
    },
    // Maestrías collections
    {
      id: 4,
      name: 'MBA - Administración de Negocios',
      description: 'Tesis del programa MBA',
      subcommunityId: 4,
      itemCount: 18,
      createdAt: new Date('2024-02-28'),
    },
    {
      id: 5,
      name: 'Maestría en Ingeniería de Software',
      description: 'Tesis de Maestría en Ingeniería de Software',
      subcommunityId: 4,
      itemCount: 12,
      createdAt: new Date('2024-03-02'),
    },
    {
      id: 6,
      name: 'Maestría en Ciencias de Datos',
      description: 'Tesis de Maestría en Ciencias de Datos',
      subcommunityId: 4,
      itemCount: 8,
      createdAt: new Date('2024-03-03'),
    },
    // Grupos de Investigación collections
    {
      id: 7,
      name: 'Grupo GITI - Tecnologías de Información',
      description: 'Producción del grupo GITI',
      subcommunityId: 7,
      itemCount: 56,
      createdAt: new Date('2024-03-18'),
    },
    {
      id: 8,
      name: 'Grupo INNOVA - Innovación Empresarial',
      description: 'Producción del grupo INNOVA',
      subcommunityId: 7,
      itemCount: 34,
      createdAt: new Date('2024-03-19'),
    },
  ]);

  // Public readonly signals
  readonly communities = this.communitiesData.asReadonly();
  readonly subcommunities = this.subcommunitiesData.asReadonly();
  readonly collections = this.collectionsData.asReadonly();

  // Computed: communities with subcommunity count
  communitiesWithCount = computed(() => {
    return this.communitiesData().map(community => ({
      ...community,
      subcommunityCount: this.subcommunitiesData().filter(s => s.communityId === community.id).length,
    }));
  });

  // Get subcommunities by community
  getSubcommunitiesByCommunity(communityId: number) {
    return computed(() => {
      return this.subcommunitiesData()
        .filter(s => s.communityId === communityId)
        .map(subcommunity => ({
          ...subcommunity,
          collectionCount: this.collectionsData().filter(c => c.subcommunityId === subcommunity.id).length,
        }));
    });
  }

  // Get collections by subcommunity
  getCollectionsBySubcommunity(subcommunityId: number) {
    return computed(() => {
      return this.collectionsData().filter(c => c.subcommunityId === subcommunityId);
    });
  }

  // Get single items
  getCommunityById(id: number): Community | undefined {
    return this.communitiesData().find(c => c.id === id);
  }

  getSubcommunityById(id: number): Subcommunity | undefined {
    const subcommunity = this.subcommunitiesData().find(s => s.id === id);
    if (subcommunity) {
      return {
        ...subcommunity,
        community: this.getCommunityById(subcommunity.communityId),
      };
    }
    return undefined;
  }

  getCollectionById(id: number): Collection | undefined {
    const collection = this.collectionsData().find(c => c.id === id);
    if (collection) {
      const subcommunity = this.getSubcommunityById(collection.subcommunityId);
      return {
        ...collection,
        subcommunity,
      };
    }
    return undefined;
  }

  // CRUD Operations - Communities
  createCommunity(data: CommunityCreate): Community {
    const newId = Math.max(...this.communitiesData().map(c => c.id), 0) + 1;
    const newCommunity: Community = {
      id: newId,
      ...data,
      createdAt: new Date(),
    };
    this.communitiesData.update(communities => [...communities, newCommunity]);
    return newCommunity;
  }

  updateCommunity(id: number, data: Partial<CommunityCreate>): void {
    this.communitiesData.update(communities =>
      communities.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date() } : c)
    );
  }

  deleteCommunity(id: number): void {
    // Also delete related subcommunities and collections
    const subcommunityIds = this.subcommunitiesData()
      .filter(s => s.communityId === id)
      .map(s => s.id);

    this.collectionsData.update(collections =>
      collections.filter(c => !subcommunityIds.includes(c.subcommunityId))
    );
    this.subcommunitiesData.update(subcommunities =>
      subcommunities.filter(s => s.communityId !== id)
    );
    this.communitiesData.update(communities =>
      communities.filter(c => c.id !== id)
    );
  }

  // CRUD Operations - Subcommunities
  createSubcommunity(data: SubcommunityCreate): Subcommunity {
    const newId = Math.max(...this.subcommunitiesData().map(s => s.id), 0) + 1;
    const newSubcommunity: Subcommunity = {
      id: newId,
      ...data,
      createdAt: new Date(),
    };
    this.subcommunitiesData.update(subcommunities => [...subcommunities, newSubcommunity]);
    return newSubcommunity;
  }

  updateSubcommunity(id: number, data: Partial<SubcommunityCreate>): void {
    this.subcommunitiesData.update(subcommunities =>
      subcommunities.map(s => s.id === id ? { ...s, ...data, updatedAt: new Date() } : s)
    );
  }

  deleteSubcommunity(id: number): void {
    // Also delete related collections
    this.collectionsData.update(collections =>
      collections.filter(c => c.subcommunityId !== id)
    );
    this.subcommunitiesData.update(subcommunities =>
      subcommunities.filter(s => s.id !== id)
    );
  }

  // CRUD Operations - Collections
  createCollection(data: CollectionCreate): Collection {
    const newId = Math.max(...this.collectionsData().map(c => c.id), 0) + 1;
    const newCollection: Collection = {
      id: newId,
      ...data,
      itemCount: 0,
      createdAt: new Date(),
    };
    this.collectionsData.update(collections => [...collections, newCollection]);
    return newCollection;
  }

  updateCollection(id: number, data: Partial<CollectionCreate>): void {
    this.collectionsData.update(collections =>
      collections.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date() } : c)
    );
  }

  deleteCollection(id: number): void {
    this.collectionsData.update(collections =>
      collections.filter(c => c.id !== id)
    );
  }
}
