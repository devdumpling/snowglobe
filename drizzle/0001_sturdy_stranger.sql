CREATE INDEX "guestbook_user_id_idx" ON "guestbook_entry" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "guestbook_created_at_idx" ON "guestbook_entry" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");