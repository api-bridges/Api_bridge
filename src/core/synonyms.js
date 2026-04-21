/**
 * yarou v7 — Developer Vocabulary Synonym Dictionary
 *
 * Expanded for v2 with more domain-specific groups,
 * abbreviation handling, and internationalised variants.
 * v3: additional healthcare, analytics, and infrastructure groups.
 * v7: additional financial, IoT, education, and social groups.
 */

const SYNONYM_GROUPS = [
  // ── Identity ────────────────────────────────────────────────
  ["id", "identifier", "uid", "uuid", "key", "pk", "primary_key", "record_id", "_id", "oid", "object_id"],

  // ── Person Name ─────────────────────────────────────────────
  ["first_name", "firstname", "fname", "given_name", "forename", "first"],
  ["last_name", "lastname", "lname", "surname", "family_name", "last"],
  ["full_name", "fullname", "name", "display_name", "displayname", "complete_name"],
  ["middle_name", "middlename", "mname", "middle"],
  ["username", "user_name", "uname", "login", "handle", "screen_name", "login_id"],
  ["nickname", "nick", "alias", "preferred_name", "short_name"],
  ["prefix", "title", "salutation", "honorific", "mr", "mrs", "dr"],
  ["suffix", "name_suffix", "generational"],

  // ── Contact ─────────────────────────────────────────────────
  ["email", "email_address", "emailaddress", "mail", "e_mail", "email_id"],
  ["phone", "phone_number", "phonenumber", "mobile", "mobile_number",
   "cell", "cell_number", "contact_number", "tel", "telephone", "phone_no"],
  ["address", "addr", "location", "place", "residence", "mailing_address"],
  ["street", "street_address", "addr_line1", "address_line1",
   "address_line_1", "line1", "addr1", "street_name"],
  ["street2", "addr_line2", "address_line2", "address_line_2", "line2", "addr2", "apt", "suite"],
  ["city", "town", "addr_city", "address_city", "locality", "municipality"],
  ["state", "province", "region", "addr_state", "state_code", "state_province"],
  ["country", "nation", "addr_country", "country_name", "country_code", "cc"],
  ["zip", "zipcode", "zip_code", "pincode", "pin_code",
   "postal_code", "postcode", "post_code", "postal"],

  // ── Authentication ──────────────────────────────────────────
  ["password", "pwd", "pw", "pass", "passwd", "secret"],
  ["token", "access_token", "auth_token", "jwt", "bearer", "api_key", "apikey"],
  ["refresh_token", "refreshtoken", "refresh"],
  ["otp", "one_time_password", "verification_code", "code", "pin", "mfa_code", "two_factor_code"],
  ["role", "user_role", "access_level", "permission_level", "authority"],
  ["scope", "permission", "permissions", "grant", "grants", "acl"],
  ["session", "session_id", "sid", "session_token"],

  // ── Status / Boolean ────────────────────────────────────────
  ["is_active", "isactive", "active", "enabled", "status",
   "is_enabled", "activated", "live"],
  ["is_deleted", "isdeleted", "deleted", "removed", "is_removed", "trashed"],
  ["is_verified", "isverified", "verified", "confirmed", "is_confirmed", "email_verified"],
  ["is_admin", "isadmin", "admin", "is_superuser", "superuser", "is_staff"],
  ["is_blocked", "isblocked", "blocked", "banned", "is_banned", "suspended", "is_suspended"],
  ["is_premium", "ispremium", "premium", "is_pro", "pro", "subscribed", "is_paid"],
  ["is_public", "ispublic", "public", "visibility", "is_visible", "published"],
  ["is_default", "isdefault", "default", "is_primary", "primary"],
  ["is_read", "isread", "read", "seen", "is_seen", "viewed"],

  // ── Dates ───────────────────────────────────────────────────
  ["created_at", "createdat", "created", "creation_date",
   "date_created", "insert_date", "added_at", "created_on", "create_time"],
  ["updated_at", "updatedat", "updated", "modified_at",
   "last_modified", "date_modified", "last_updated", "modified_on", "update_time"],
  ["deleted_at", "deletedat", "removed_at", "date_deleted", "purged_at"],
  ["dob", "date_of_birth", "dateofbirth", "birth_date",
   "birthdate", "birthday", "birth_day"],
  ["expires_at", "expiresat", "expiry", "expiry_date",
   "expiration", "expiration_date", "valid_until", "ttl_date"],
  ["published_at", "publishedat", "published_date", "release_date", "go_live_date"],
  ["joined_at", "joinedat", "registered_at", "signup_date", "enrollment_date", "member_since"],
  ["started_at", "startedat", "start_time", "begin_time", "commenced_at"],
  ["ended_at", "endedat", "end_time", "finish_time", "completed_at"],

  // ── Media ───────────────────────────────────────────────────
  ["image", "img", "photo", "picture", "pic",
   "avatar", "thumbnail", "profile_image", "profile_pic", "icon", "logo"],
  ["video", "vid", "clip", "media", "movie", "recording"],
  ["file", "attachment", "document", "doc", "upload", "asset"],
  ["url", "link", "href", "src", "path", "uri", "endpoint", "web_url"],
  ["mime_type", "mimetype", "content_type", "contenttype", "file_type", "media_type"],
  ["file_size", "filesize", "size", "content_length", "byte_size", "bytes"],

  // ── Pricing ─────────────────────────────────────────────────
  ["price", "cost", "amount", "fee", "charge", "rate", "value", "unit_price"],
  ["discount", "discount_amount", "offer", "reduction", "savings", "promo"],
  ["tax", "tax_amount", "gst", "vat", "duty", "tax_rate"],
  ["total", "total_amount", "grand_total", "final_amount", "net_amount", "subtotal", "sub_total"],
  ["currency", "currency_code", "curr", "money_code", "iso_currency"],
  ["quantity", "qty", "count", "num", "number", "units", "amount_count"],

  // ── Description / Content ───────────────────────────────────
  ["description", "desc", "details", "info", "about", "summary", "overview", "bio", "blurb"],
  ["title", "heading", "label", "caption", "subject"],
  ["content", "body", "text", "message", "html", "raw_content"],
  ["notes", "note", "comment", "remarks", "remark", "feedback", "memo"],
  ["tags", "tag", "keywords", "categories", "labels", "topics"],
  ["slug", "permalink", "url_slug", "seo_url", "friendly_url", "handle"],

  // ── User / Account ──────────────────────────────────────────
  ["user", "usr", "member", "account", "profile", "person"],
  ["user_id", "userid", "uid", "member_id", "account_id", "profile_id"],
  ["owner", "owner_id", "created_by", "author", "author_id", "user_ref", "creator"],
  ["assignee", "assigned_to", "assignee_id", "responsible", "handler"],

  // ── Relations / Hierarchy ───────────────────────────────────
  ["parent", "parent_id", "parentid", "parent_ref"],
  ["children", "child", "kids", "sub_items", "nested", "child_items"],
  ["category", "cat", "type", "group", "kind", "class", "classification"],
  ["category_id", "cat_id", "type_id", "group_id", "class_id"],
  ["priority", "urgency", "importance", "severity", "level", "rank", "weight"],
  ["sort_order", "sortorder", "order", "position", "index", "sequence", "display_order"],

  // ── Pagination ──────────────────────────────────────────────
  ["page", "page_number", "pg", "current_page"],
  ["limit", "per_page", "page_size", "size", "rows", "count"],
  ["total", "total_count", "total_records", "total_items", "record_count"],
  ["offset", "skip", "start", "from"],
  ["cursor", "next_cursor", "continuation_token", "page_token"],
  ["has_more", "has_next", "has_next_page", "more"],

  // ── Response Meta ───────────────────────────────────────────
  ["success", "ok", "status", "result", "is_success"],
  ["error", "err", "message", "error_message", "msg", "reason", "error_msg"],
  ["data", "result", "payload", "response", "body", "items", "records", "rows"],
  ["code", "status_code", "http_code", "error_code", "response_code"],

  // ── Timestamps ──────────────────────────────────────────────
  ["timestamp", "time", "datetime", "date_time", "ts", "epoch"],
  ["start_date", "startdate", "start", "from_date", "begin", "effective_from"],
  ["end_date", "enddate", "end", "to_date", "until", "effective_to", "through"],
  ["duration", "elapsed", "time_spent", "time_taken", "runtime", "processing_time"],

  // ── Location / Geo ──────────────────────────────────────────
  ["latitude", "lat", "y_coord", "geo_lat"],
  ["longitude", "lng", "lon", "long", "x_coord", "geo_lng"],
  ["coordinates", "coords", "geo", "location", "latlng", "geo_point"],
  ["timezone", "tz", "time_zone", "utc_offset", "iana_timezone"],

  // ── Business / Commerce ─────────────────────────────────────
  ["company", "organisation", "organization", "org", "business", "firm", "enterprise"],
  ["order", "order_id", "booking", "booking_id", "transaction", "purchase"],
  ["invoice", "bill", "receipt", "statement"],
  ["product", "item", "goods", "listing", "sku", "merchandise"],
  ["customer", "client", "buyer", "purchaser", "consumer", "patron"],
  ["vendor", "supplier", "seller", "merchant", "provider"],
  ["shipping", "delivery", "fulfillment", "dispatch", "shipment"],
  ["tracking", "tracking_number", "tracking_id", "shipment_tracking", "awb"],

  // ── Technical / Dev ─────────────────────────────────────────
  ["version", "ver", "v", "revision", "rev", "build"],
  ["environment", "env", "stage", "tier", "deployment"],
  ["config", "configuration", "settings", "preferences", "options"],
  ["language", "lang", "locale", "i18n", "l10n"],
  ["platform", "os", "device", "client_type", "user_agent"],
  ["ip_address", "ip", "ip_addr", "remote_addr", "client_ip", "source_ip"],

  // ── Healthcare (v3) ─────────────────────────────────────────
  ["patient", "patient_id", "patientid", "mrn", "medical_record_number"],
  ["diagnosis", "dx", "condition", "icd_code", "icd"],
  ["prescription", "rx", "medication", "med", "drug", "treatment"],
  ["provider", "doctor", "physician", "practitioner", "clinician", "npi"],
  ["appointment", "visit", "encounter", "booking", "slot", "schedule"],

  // ── Analytics / Metrics (v3) ────────────────────────────────
  ["metric", "measure", "kpi", "indicator", "stat", "statistic"],
  ["dimension", "attribute", "property", "facet", "segment"],
  ["conversion", "conversion_rate", "cvr", "goal_completion"],
  ["impression", "view", "pageview", "hit", "visit"],
  ["click", "tap", "interaction", "engagement", "action"],
  ["bounce_rate", "exit_rate", "abandonment_rate"],
  ["session_duration", "time_on_page", "dwell_time", "engagement_time"],

  // ── Infrastructure / DevOps (v3) ────────────────────────────
  ["host", "hostname", "server", "node", "instance", "machine"],
  ["container", "pod", "service", "replica", "task"],
  ["cluster", "group", "pool", "fleet", "farm"],
  ["region", "zone", "datacenter", "dc", "availability_zone", "az"],
  ["cpu", "cpu_usage", "processor", "compute", "vcpu"],
  ["memory", "ram", "mem", "memory_usage", "heap"],
  ["disk", "storage", "volume", "disk_usage", "fs"],
  ["network", "bandwidth", "throughput", "traffic", "io"],
  ["log", "log_entry", "log_line", "trace", "span", "event"],

  // ── Financial / Banking (v7) ───────────────────────────────
  ["balance", "account_balance", "bal", "available_balance", "ledger_balance"],
  ["credit", "credit_amount", "crd", "credit_entry"],
  ["debit", "debit_amount", "dbt", "debit_entry"],
  ["routing_number", "routing", "rtn", "aba", "sort_code"],
  ["account_number", "acn", "iban", "account_no"],
  ["interest", "interest_rate", "apr", "apy", "rate"],
  ["deposit", "credit", "incoming", "inflow"],
  ["withdrawal", "debit", "outgoing", "outflow"],
  ["transfer", "wire", "remittance", "send", "movement"],
  ["loan", "mortgage", "credit_line", "facility", "advance"],

  // ── IoT / Hardware (v7) ────────────────────────────────────
  ["device", "dev", "gadget", "endpoint", "thing", "asset"],
  ["sensor", "sen", "probe", "detector", "reader"],
  ["temperature", "temp", "tmp", "celsius", "fahrenheit", "kelvin"],
  ["humidity", "hum", "moisture", "rh", "relative_humidity"],
  ["firmware", "fw", "bios", "embedded_software"],
  ["battery", "batt", "power_level", "charge", "energy_level"],
  ["signal", "sig", "rssi", "signal_strength", "reception"],
  ["frequency", "freq", "hz", "hertz", "rate"],

  // ── Education (v7) ─────────────────────────────────────────
  ["student", "pupil", "learner", "enrollee", "participant"],
  ["teacher", "instructor", "professor", "tutor", "educator", "faculty"],
  ["course", "class", "subject", "module", "program", "curriculum"],
  ["grade", "score", "mark", "rating", "result", "gpa"],
  ["enrollment", "registration", "admission", "matriculation"],
  ["semester", "term", "quarter", "academic_period", "session"],

  // ── Social / Communication (v7) ────────────────────────────
  ["follower", "subscriber", "fan", "connection"],
  ["friend", "contact", "buddy", "connection"],
  ["post", "article", "entry", "publication", "update"],
  ["like", "upvote", "reaction", "favorite", "heart", "star"],
  ["share", "repost", "retweet", "forward", "redistribute"],
  ["notification", "notif", "alert", "push", "announcement"],
];

// Build flat lookup map: word → group index
const WORD_TO_GROUP = new Map();
SYNONYM_GROUPS.forEach((group, idx) => {
  group.forEach(word => {
    WORD_TO_GROUP.set(word.toLowerCase(), idx);
  });
});

module.exports = { SYNONYM_GROUPS, WORD_TO_GROUP };
