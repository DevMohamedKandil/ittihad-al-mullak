import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Send,
  ChevronLeft,
  Users,
  Building2,
  Search,
} from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { OwnerHeader } from '../header';
import { ConversationsApi } from '../../../core/api.services';
import { ChatMessage, Conversation } from '../../../core/models';
import { formatRelative } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-owner-messages',
  imports: [FormsModule, OwnerHeader, LucideAngularModule, TranslatePipe],
  templateUrl: './messages.html',
})
export class OwnerMessages {
  private readonly conversationsApi = inject(ConversationsApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    send: Send,
    chevronLeft: ChevronLeft,
    users: Users,
    building2: Building2,
    search: Search,
  };

  protected readonly formatRelative = formatRelative;

  protected readonly conversations = signal<Conversation[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly search = signal('');
  protected readonly selectedConversationId = signal<number | null>(null);
  protected readonly message = signal('');
  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly messagesLoading = signal(false);
  protected readonly sending = signal(false);

  protected readonly filteredConversations = computed(() =>
    this.conversations().filter((conv) => conv.name.includes(this.search())),
  );

  protected readonly selectedConversation = computed(
    () => this.conversations().find((conv) => conv.id === this.selectedConversationId()) ?? null,
  );

  constructor() {
    this.conversationsApi.mine().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }

  protected selectConversation(id: number) {
    this.selectedConversationId.set(id);
    this.messages.set([]);
    this.messagesLoading.set(true);
    this.conversationsApi.messages(id).subscribe({
      next: (messages) => {
        this.messages.set(messages);
        this.messagesLoading.set(false);
        // تصفير عداد غير المقروء محلياً بعد فتح المحادثة
        this.conversations.update((list) =>
          list.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
        );
      },
      error: () => this.messagesLoading.set(false),
    });
  }

  /** محادثة مع الإدارة — تُنشأ إذا لم تكن موجودة */
  protected startAdminConversation() {
    this.conversationsApi.start(null).subscribe({
      next: (conversation) => {
        this.conversations.update((list) =>
          list.some((c) => c.id === conversation.id) ? list : [conversation, ...list],
        );
        this.selectConversation(conversation.id);
      },
      error: (err) => this.error.set(err.error?.title ?? this.i18n.t('owner.messages.startFailed')),
    });
  }

  protected openGroupConversation() {
    const group = this.conversations().find((c) => c.isGroup);
    if (group) this.selectConversation(group.id);
  }

  protected back() {
    this.selectedConversationId.set(null);
  }

  protected avatarClass(conversation: Conversation): string {
    return conversation.isGroup
      ? 'bg-success text-success-foreground'
      : 'bg-primary text-primary-foreground';
  }

  protected handleSend() {
    const content = this.message().trim();
    const id = this.selectedConversationId();
    if (!content || id === null || this.sending()) return;

    this.sending.set(true);
    this.conversationsApi.send(id, content).subscribe({
      next: (sent) => {
        this.messages.update((messages) => [...messages, sent]);
        this.message.set('');
        this.sending.set(false);
        this.conversations.update((list) =>
          list.map((c) =>
            c.id === id ? { ...c, lastMessage: sent.content, lastMessageAt: sent.sentAt } : c,
          ),
        );
      },
      error: () => this.sending.set(false),
    });
  }

  protected onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.handleSend();
    }
  }
}
