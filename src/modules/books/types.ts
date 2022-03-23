export interface BookListItem {
  cover_i: number
  has_fulltext: boolean
  edition_count: number
  title: string
  author_name?: string[]
  first_publish_year: number
  first_sentence?: string[]
  key: string
  ia: string[]
  author_key: string[]
  public_scan_b: boolean
}

export interface BookWorkAuthor {
  author: { key: string }
  type: { key: string }
}

export interface BookWorkType {
  key: string
}

export interface TypedDate {
  type: '/type/datetime' // or others
  value: string
}

export interface BookWork {
  description:
    | {
        type: string
        value: string
      }
    | string
  title: string
  covers?: number[]
  subject_places?: string[]
  subjects?: string[]
  subject_people?: string[]
  key: string
  authors: BookWorkAuthor[]
  subject_times?: string
  type: BookWorkType
  latest_revision: number
  revision: number
  created: TypedDate
  last_modified: TypedDate
  links?: {
    title: string
    type: { key: string }
    url: string
  }[]
  excerpts?: {
    author: { key: string }
    excerpt: string
    pages: string
  }[]
}
