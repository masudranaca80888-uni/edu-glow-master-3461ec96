export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attempt_answers: {
        Row: {
          attempt_id: string
          chosen_option: string | null
          created_at: string
          id: string
          is_correct: boolean
          mcq_id: string
          time_spent_ms: number
        }
        Insert: {
          attempt_id: string
          chosen_option?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean
          mcq_id: string
          time_spent_ms?: number
        }
        Update: {
          attempt_id?: string
          chosen_option?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean
          mcq_id?: string
          time_spent_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "attempt_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_mcq_id_fkey"
            columns: ["mcq_id"]
            isOneToOne: false
            referencedRelation: "mcqs"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_attempts: {
        Row: {
          attempt_number: number
          chapter_id: string | null
          completed_at: string | null
          correct_count: number
          created_at: string
          duration_seconds: number
          id: string
          kind: Database["public"]["Enums"]["attempt_kind"]
          level: string | null
          meta: Json
          quiz_id: string | null
          score: number
          started_at: string
          status: Database["public"]["Enums"]["attempt_status"]
          subject_id: string | null
          title: string | null
          total_count: number
          user_id: string
        }
        Insert: {
          attempt_number?: number
          chapter_id?: string | null
          completed_at?: string | null
          correct_count?: number
          created_at?: string
          duration_seconds?: number
          id?: string
          kind?: Database["public"]["Enums"]["attempt_kind"]
          level?: string | null
          meta?: Json
          quiz_id?: string | null
          score?: number
          started_at?: string
          status?: Database["public"]["Enums"]["attempt_status"]
          subject_id?: string | null
          title?: string | null
          total_count?: number
          user_id: string
        }
        Update: {
          attempt_number?: number
          chapter_id?: string | null
          completed_at?: string | null
          correct_count?: number
          created_at?: string
          duration_seconds?: number
          id?: string
          kind?: Database["public"]["Enums"]["attempt_kind"]
          level?: string | null
          meta?: Json
          quiz_id?: string | null
          score?: number
          started_at?: string
          status?: Database["public"]["Enums"]["attempt_status"]
          subject_id?: string | null
          title?: string | null
          total_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_card_visibility: {
        Row: {
          hidden_chapter_ids: string[]
          hidden_levels: string[]
          hidden_subject_ids: string[]
          id: number
          section_hidden: boolean
          updated_at: string
        }
        Insert: {
          hidden_chapter_ids?: string[]
          hidden_levels?: string[]
          hidden_subject_ids?: string[]
          id?: number
          section_hidden?: boolean
          updated_at?: string
        }
        Update: {
          hidden_chapter_ids?: string[]
          hidden_levels?: string[]
          hidden_subject_ids?: string[]
          id?: number
          section_hidden?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      flash_cards: {
        Row: {
          back: string
          card_type: Database["public"]["Enums"]["flash_card_type"]
          chapter_id: string | null
          created_at: string
          created_by: string | null
          formula: string | null
          front: string
          id: string
          image_url: string | null
          is_hidden: boolean
          level: string
          scheduled_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          subject_id: string | null
          tags: string[]
          updated_at: string
          view_count: number
        }
        Insert: {
          back: string
          card_type?: Database["public"]["Enums"]["flash_card_type"]
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          formula?: string | null
          front: string
          id?: string
          image_url?: string | null
          is_hidden?: boolean
          level?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          tags?: string[]
          updated_at?: string
          view_count?: number
        }
        Update: {
          back?: string
          card_type?: Database["public"]["Enums"]["flash_card_type"]
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          formula?: string | null
          front?: string
          id?: string
          image_url?: string | null
          is_hidden?: boolean
          level?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          tags?: string[]
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "flash_cards_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flash_cards_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          code: string
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          name: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          name: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          name?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      mcq_bookmarks: {
        Row: {
          chapter_id: string | null
          created_at: string
          id: string
          level: string | null
          mcq_id: string
          subject_id: string | null
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          id?: string
          level?: string | null
          mcq_id: string
          subject_id?: string | null
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          id?: string
          level?: string | null
          mcq_id?: string
          subject_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mcq_wrong_questions: {
        Row: {
          chapter_id: string | null
          correct_option: string | null
          first_wrong_at: string
          id: string
          last_chosen_option: string | null
          last_wrong_at: string
          level: string | null
          mastered: boolean
          mcq_id: string
          retry_count: number
          subject_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          correct_option?: string | null
          first_wrong_at?: string
          id?: string
          last_chosen_option?: string | null
          last_wrong_at?: string
          level?: string | null
          mastered?: boolean
          mcq_id: string
          retry_count?: number
          subject_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          correct_option?: string | null
          first_wrong_at?: string
          id?: string
          last_chosen_option?: string | null
          last_wrong_at?: string
          level?: string | null
          mastered?: boolean
          mcq_id?: string
          retry_count?: number
          subject_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mcqs: {
        Row: {
          chapter_id: string
          correct_option: string
          created_at: string
          created_by: string | null
          difficulty: Database["public"]["Enums"]["mcq_difficulty"]
          explanation: string | null
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          status: Database["public"]["Enums"]["content_status"]
          tags: string[]
          updated_at: string
        }
        Insert: {
          chapter_id: string
          correct_option: string
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["mcq_difficulty"]
          explanation?: string | null
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          correct_option?: string
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["mcq_difficulty"]
          explanation?: string | null
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcqs_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      module_visibility: {
        Row: {
          hidden: boolean
          key: string
          label: string
          updated_at: string
        }
        Insert: {
          hidden?: boolean
          key: string
          label: string
          updated_at?: string
        }
        Update: {
          hidden?: boolean
          key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          audience: Database["public"]["Enums"]["notification_audience"]
          audience_level: string | null
          audience_role: Database["public"]["Enums"]["app_role"] | null
          audience_subject_id: string | null
          audience_user_ids: string[]
          body: string
          created_at: string
          created_by: string | null
          delivered_count: number
          id: string
          link: string | null
          open_count: number
          priority: Database["public"]["Enums"]["notification_priority"]
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
        }
        Insert: {
          audience?: Database["public"]["Enums"]["notification_audience"]
          audience_level?: string | null
          audience_role?: Database["public"]["Enums"]["app_role"] | null
          audience_subject_id?: string | null
          audience_user_ids?: string[]
          body?: string
          created_at?: string
          created_by?: string | null
          delivered_count?: number
          id?: string
          link?: string | null
          open_count?: number
          priority?: Database["public"]["Enums"]["notification_priority"]
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Update: {
          audience?: Database["public"]["Enums"]["notification_audience"]
          audience_level?: string | null
          audience_role?: Database["public"]["Enums"]["app_role"] | null
          audience_subject_id?: string | null
          audience_user_ids?: string[]
          body?: string
          created_at?: string
          created_by?: string | null
          delivered_count?: number
          id?: string
          link?: string | null
          open_count?: number
          priority?: Database["public"]["Enums"]["notification_priority"]
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          level: string
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          level?: string
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          level?: string
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: []
      }
      question_bank_resources: {
        Row: {
          body: string | null
          chapter_id: string | null
          created_at: string
          created_by: string | null
          download_count: number
          file_name: string | null
          file_size_bytes: number | null
          file_url: string | null
          id: string
          is_hidden: boolean
          kind: Database["public"]["Enums"]["qb_kind"]
          level: string
          question_count: number
          resource_type: string
          scheduled_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          subject_id: string | null
          summary: string | null
          tags: string[]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          body?: string | null
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          download_count?: number
          file_name?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          is_hidden?: boolean
          kind?: Database["public"]["Enums"]["qb_kind"]
          level?: string
          question_count?: number
          resource_type?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          summary?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          body?: string | null
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          download_count?: number
          file_name?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          is_hidden?: boolean
          kind?: Database["public"]["Enums"]["qb_kind"]
          level?: string
          question_count?: number
          resource_type?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          summary?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      question_bank_visibility: {
        Row: {
          hidden_chapter_ids: string[]
          hidden_levels: string[]
          hidden_subject_ids: string[]
          id: number
          section_hidden: boolean
          updated_at: string
        }
        Insert: {
          hidden_chapter_ids?: string[]
          hidden_levels?: string[]
          hidden_subject_ids?: string[]
          id?: number
          section_hidden?: boolean
          updated_at?: string
        }
        Update: {
          hidden_chapter_ids?: string[]
          hidden_levels?: string[]
          hidden_subject_ids?: string[]
          id?: number
          section_hidden?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          id: string
          mcq_id: string
          position: number
          quiz_id: string
        }
        Insert: {
          id?: string
          mcq_id: string
          position?: number
          quiz_id: string
        }
        Update: {
          id?: string
          mcq_id?: string
          position?: number
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_mcq_id_fkey"
            columns: ["mcq_id"]
            isOneToOne: false
            referencedRelation: "mcqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          chapter_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["mcq_difficulty"]
          duration_seconds: number
          ends_at: string | null
          id: string
          is_public: boolean
          kind: string
          level: string
          negative_marking: number
          passing_marks: number
          randomize_options: boolean
          randomize_questions: boolean
          starts_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          subject_id: string | null
          title: string
          total_questions: number
          updated_at: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["mcq_difficulty"]
          duration_seconds?: number
          ends_at?: string | null
          id?: string
          is_public?: boolean
          kind?: string
          level?: string
          negative_marking?: number
          passing_marks?: number
          randomize_options?: boolean
          randomize_questions?: boolean
          starts_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          title: string
          total_questions?: number
          updated_at?: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["mcq_difficulty"]
          duration_seconds?: number
          ends_at?: string | null
          id?: string
          is_public?: boolean
          kind?: string
          level?: string
          negative_marking?: number
          passing_marks?: number
          randomize_options?: boolean
          randomize_questions?: boolean
          starts_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          title?: string
          total_questions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      short_notes: {
        Row: {
          body: string | null
          chapter_id: string | null
          created_at: string
          created_by: string | null
          download_count: number
          file_name: string | null
          file_size_bytes: number | null
          file_url: string | null
          id: string
          is_hidden: boolean
          kind: Database["public"]["Enums"]["short_note_kind"]
          level: string
          scheduled_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          subject_id: string | null
          summary: string | null
          tags: string[]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          body?: string | null
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          download_count?: number
          file_name?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          is_hidden?: boolean
          kind?: Database["public"]["Enums"]["short_note_kind"]
          level?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          summary?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          body?: string | null
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          download_count?: number
          file_name?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          is_hidden?: boolean
          kind?: Database["public"]["Enums"]["short_note_kind"]
          level?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          summary?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "short_notes_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "short_notes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      short_notes_visibility: {
        Row: {
          hidden_chapter_ids: string[]
          hidden_levels: string[]
          hidden_subject_ids: string[]
          id: number
          section_hidden: boolean
          updated_at: string
        }
        Insert: {
          hidden_chapter_ids?: string[]
          hidden_levels?: string[]
          hidden_subject_ids?: string[]
          id?: number
          section_hidden?: boolean
          updated_at?: string
        }
        Update: {
          hidden_chapter_ids?: string[]
          hidden_levels?: string[]
          hidden_subject_ids?: string[]
          id?: number
          section_hidden?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          level: string
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          level?: string
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          level?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_class_visibility: {
        Row: {
          hidden_chapter_ids: string[]
          hidden_levels: string[]
          hidden_subject_ids: string[]
          id: number
          section_hidden: boolean
          updated_at: string
        }
        Insert: {
          hidden_chapter_ids?: string[]
          hidden_levels?: string[]
          hidden_subject_ids?: string[]
          id?: number
          section_hidden?: boolean
          updated_at?: string
        }
        Update: {
          hidden_chapter_ids?: string[]
          hidden_levels?: string[]
          hidden_subject_ids?: string[]
          id?: number
          section_hidden?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      video_classes: {
        Row: {
          chapter_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_seconds: number
          id: string
          instructor: string | null
          is_featured: boolean
          is_hidden: boolean
          kind: Database["public"]["Enums"]["video_class_kind"]
          level: string
          playlist_key: string | null
          position: number
          scheduled_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          subject_id: string | null
          tags: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number
          youtube_playlist_id: string | null
          youtube_url: string | null
          youtube_video_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_seconds?: number
          id?: string
          instructor?: string | null
          is_featured?: boolean
          is_hidden?: boolean
          kind?: Database["public"]["Enums"]["video_class_kind"]
          level?: string
          playlist_key?: string | null
          position?: number
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number
          youtube_playlist_id?: string | null
          youtube_url?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_seconds?: number
          id?: string
          instructor?: string | null
          is_featured?: boolean
          is_hidden?: boolean
          kind?: Database["public"]["Enums"]["video_class_kind"]
          level?: string
          playlist_key?: string | null
          position?: number
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number
          youtube_playlist_id?: string | null
          youtube_url?: string | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      quiz_leaderboard: {
        Row: {
          avatar_url: string | null
          completed_at: string | null
          correct_count: number | null
          display_name: string | null
          duration_seconds: number | null
          quiz_id: string | null
          score: number | null
          total_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "student"
      attempt_kind: "mcq_practice" | "quiz" | "mock" | "custom_exam"
      attempt_status: "in_progress" | "completed" | "abandoned"
      content_status: "draft" | "published" | "archived"
      flash_card_type:
        | "concept"
        | "formula"
        | "diagram"
        | "timeline"
        | "definition"
        | "other"
      mcq_difficulty: "easy" | "medium" | "hard"
      notification_audience: "all" | "level" | "subject" | "role" | "users"
      notification_priority: "low" | "medium" | "high" | "critical"
      notification_status: "draft" | "scheduled" | "sent" | "failed" | "paused"
      notification_type: "announcement" | "push" | "email" | "in_app"
      profile_status: "active" | "suspended" | "pending"
      qb_kind: "text" | "pdf" | "doc"
      short_note_kind: "text" | "pdf" | "doc"
      video_class_kind: "youtube" | "playlist" | "upload"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "student"],
      attempt_kind: ["mcq_practice", "quiz", "mock", "custom_exam"],
      attempt_status: ["in_progress", "completed", "abandoned"],
      content_status: ["draft", "published", "archived"],
      flash_card_type: [
        "concept",
        "formula",
        "diagram",
        "timeline",
        "definition",
        "other",
      ],
      mcq_difficulty: ["easy", "medium", "hard"],
      notification_audience: ["all", "level", "subject", "role", "users"],
      notification_priority: ["low", "medium", "high", "critical"],
      notification_status: ["draft", "scheduled", "sent", "failed", "paused"],
      notification_type: ["announcement", "push", "email", "in_app"],
      profile_status: ["active", "suspended", "pending"],
      qb_kind: ["text", "pdf", "doc"],
      short_note_kind: ["text", "pdf", "doc"],
      video_class_kind: ["youtube", "playlist", "upload"],
    },
  },
} as const
